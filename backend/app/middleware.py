from __future__ import annotations

import time
import uuid
from collections import deque
from dataclasses import dataclass
import logging

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

logger = logging.getLogger("app.access")


def _get_client_ip(request: Request, trust_proxy_headers: bool) -> str:
    if trust_proxy_headers:
        xff = request.headers.get("x-forwarded-for")
        if xff:
            return xff.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get("x-request-id") or uuid.uuid4().hex
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["x-request-id"] = request_id
        return response


class SecureHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        response.headers.setdefault("x-content-type-options", "nosniff")
        response.headers.setdefault("x-frame-options", "DENY")
        response.headers.setdefault("referrer-policy", "no-referrer")
        response.headers.setdefault("permissions-policy", "geolocation=(), microphone=(), camera=()")
        response.headers.setdefault("cross-origin-opener-policy", "same-origin")
        response.headers.setdefault("cross-origin-resource-policy", "same-site")
        response.headers.setdefault("strict-transport-security", "max-age=31536000; includeSubDomains")
        response.headers.setdefault("content-security-policy", "default-src 'none'; frame-ancestors 'none';")
        return response


class AccessLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start = time.monotonic()
        response = await call_next(request)
        duration_ms = round((time.monotonic() - start) * 1000, 2)

        request_id = getattr(request.state, "request_id", None)
        trust_proxy = getattr(getattr(request.app, "state", None), "settings", None)
        trust_proxy_headers = True
        if trust_proxy is not None:
            trust_proxy_headers = bool(getattr(trust_proxy, "TRUST_PROXY_HEADERS", True))
        client_ip = _get_client_ip(request, trust_proxy_headers=trust_proxy_headers)

        logger.info(
            "request",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "client_ip": client_ip,
                "duration_ms": duration_ms,
            },
        )
        return response


@dataclass
class _RateBucket:
    events: deque[float]


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, *, requests_per_minute: int, trust_proxy_headers: bool) -> None:
        super().__init__(app)
        self._rpm = requests_per_minute
        self._trust_proxy_headers = trust_proxy_headers
        self._window_seconds = 60.0
        self._buckets: dict[str, _RateBucket] = {}

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        ip = _get_client_ip(request, self._trust_proxy_headers)
        now = time.monotonic()

        bucket = self._buckets.get(ip)
        if bucket is None:
            bucket = _RateBucket(events=deque())
            self._buckets[ip] = bucket

        cutoff = now - self._window_seconds
        while bucket.events and bucket.events[0] < cutoff:
            bucket.events.popleft()

        if len(bucket.events) >= self._rpm:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded"},
                headers={"retry-after": "60"},
            )

        bucket.events.append(now)
        return await call_next(request)

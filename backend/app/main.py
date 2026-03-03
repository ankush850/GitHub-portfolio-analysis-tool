from __future__ import annotations

import logging
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from starlette.responses import JSONResponse

from .config import get_settings
from .errors import UpstreamNotFoundError, UpstreamServiceError
from .logging_config import setup_logging
from .middleware import AccessLogMiddleware, RateLimitMiddleware, RequestIdMiddleware, SecureHeadersMiddleware
from .services.github_service import GitHubService

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    setup_logging("DEBUG" if settings.DEBUG else "INFO")

    timeout = httpx.Timeout(settings.HTTP_TIMEOUT_SECONDS, connect=min(5.0, settings.HTTP_TIMEOUT_SECONDS))
    headers = {"Accept": "application/vnd.github.v3+json"}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"

    client = httpx.AsyncClient(timeout=timeout, headers=headers, follow_redirects=True)
    app.state.settings = settings
    app.state.http_client = client
    app.state.github_service = GitHubService(settings=settings, client=client)

    try:
        yield
    finally:
        await client.aclose()

app = FastAPI(
    title="GitHub Portfolio Analyzer",
    description="Analyze GitHub profiles for recruiter-ready portfolios",
    version="1.0.0",
    debug=False,
    lifespan=lifespan,
)

app.add_middleware(RequestIdMiddleware)
app.add_middleware(AccessLogMiddleware)
app.add_middleware(SecureHeadersMiddleware)
app.add_middleware(
    RateLimitMiddleware,
    requests_per_minute=get_settings().RATE_LIMIT_REQUESTS_PER_MINUTE,
    trust_proxy_headers=get_settings().TRUST_PROXY_HEADERS,
)

allow_origins = get_settings().cors_allow_origins_list()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["authorization", "content-type", "x-request-id"],
)

# Include routers
app.include_router(router, prefix="/api/v1")


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", None)
    logger.exception(
        "Unhandled exception",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "client_ip": request.client.host if request.client else "unknown",
        },
    )
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})


@app.exception_handler(UpstreamServiceError)
async def upstream_exception_handler(request: Request, exc: UpstreamServiceError):
    request_id = getattr(request.state, "request_id", None)
    logger.warning(
        "Upstream service error",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "client_ip": request.client.host if request.client else "unknown",
        },
    )
    return JSONResponse(status_code=502, content={"detail": "Upstream service unavailable"})


@app.exception_handler(UpstreamNotFoundError)
async def upstream_not_found_handler(request: Request, exc: UpstreamNotFoundError):
    return JSONResponse(status_code=404, content={"detail": "Not found"})


@app.get("/")
async def root():
    return {
        "message": "Welcome to GitHub Portfolio Analyzer API",
        "version": "1.0.0",
        "endpoints": [
            "/api/v1/analyze/{username}",
            "/health"
        ]
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "GitHub Portfolio Analyzer"}
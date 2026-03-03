class UpstreamServiceError(RuntimeError):
    """Raised when an upstream dependency (e.g., GitHub API) fails."""


class UpstreamNotFoundError(UpstreamServiceError):
    """Raised when an upstream dependency reports missing resource (404)."""


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router

app = FastAPI(
    title="GitHub Portfolio Analyzer",
    description="Analyze GitHub profiles for recruiter-ready portfolios",
    version="1.0.0"
)

# -----------------------------
# CORS CONFIGURATION (IMPORTANT)
# -----------------------------
# Allows:
# - Local development
# - Render deployed frontend
# - Safe fallback during testing

origins = [
    "http://localhost:3000",
    "https://github-portfolio-frontend.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# ROUTES
# -----------------------------
app.include_router(router, prefix="/api/v1")


# -----------------------------
# ROOT ENDPOINT
# -----------------------------
@app.get("/")
async def root():
    return {
        "message": "Welcome to GitHub Portfolio Analyzer API",
        "version": "1.0.0",
        "endpoints": [
            "/api/v1/analyze/{username}",
            "/api/v1/health"
        ],
    }


# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "GitHub Portfolio Analyzer"
    }

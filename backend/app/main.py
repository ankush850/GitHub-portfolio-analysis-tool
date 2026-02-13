from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .api.routes import router
from .config import Config

app = FastAPI(
    title="GitHub Portfolio Analyzer",
    description="Analyze GitHub profiles for recruiter-ready portfolios",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Welcome to GitHub Portfolio Analyzer API",
        "version": "1.0.0",
        "endpoints": [
            "/api/v1/analyze/{username}",
            "/api/v1/health"
        ]
    }

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "GitHub Portfolio Analyzer"}
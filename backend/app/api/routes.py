from fastapi import APIRouter, Depends, HTTPException
from starlette.requests import Request
from typing import Any

from ..services.github_service import GitHubService
from ..services.analyzer_service import AnalyzerService
from ..services.score_calculator import ScoreCalculator
from ..services.recruiter_simulator import RecruiterSimulator
from ..services.roadmap_generator import RoadmapGenerator
from ..models.user_profile import UserProfile
from ..utils.helpers import validate_github_repo_name, validate_github_username
from ..config import Settings
from ..errors import UpstreamNotFoundError

router = APIRouter()


def get_settings(request: Request) -> Settings:
    return request.app.state.settings


def get_github_service(request: Request) -> GitHubService:
    return request.app.state.github_service


def get_analyzer_service(
    request: Request, github_service: GitHubService = Depends(get_github_service)
) -> AnalyzerService:
    return AnalyzerService(github_service=github_service, settings=request.app.state.settings)


def get_score_calculator(request: Request) -> ScoreCalculator:
    return ScoreCalculator(settings=request.app.state.settings)


def get_recruiter_simulator() -> RecruiterSimulator:
    return RecruiterSimulator()


def get_roadmap_generator() -> RoadmapGenerator:
    return RoadmapGenerator()


@router.get("/analyze/{username}")
async def analyze_github_profile(
    username: str,
    settings: Settings = Depends(get_settings),
    github_service: GitHubService = Depends(get_github_service),
    analyzer: AnalyzerService = Depends(get_analyzer_service),
    score_calculator: ScoreCalculator = Depends(get_score_calculator),
    recruiter_sim: RecruiterSimulator = Depends(get_recruiter_simulator),
    roadmap_gen: RoadmapGenerator = Depends(get_roadmap_generator),
):
    """
    Analyze a GitHub profile and return comprehensive portfolio analysis
    """
    if not validate_github_username(username):
        raise HTTPException(status_code=400, detail="Invalid GitHub username")

    user_data = await github_service.get_user_profile(username)
    repositories = await github_service.get_repositories(username)

    repositories = repositories[: settings.MAX_REPOS_TO_ANALYZE]

    analyzed_repos = []
    for repo in repositories:
        repo_analysis = await analyzer.analyze_repository(repo)
        analyzed_repos.append(repo_analysis)

    portfolio_score = score_calculator.calculate_portfolio_score(user_data, analyzed_repos)
    recruiter_feedback = recruiter_sim.simulate_review(user_data, analyzed_repos, portfolio_score)
    roadmap = roadmap_gen.generate_roadmap(portfolio_score, analyzed_repos)

    profile = UserProfile(
        username=username,
        user_data=user_data,
        repositories=analyzed_repos,
        score=portfolio_score,
        recruiter_feedback=recruiter_feedback,
        roadmap=roadmap,
    )

    return profile.model_dump()

@router.get("/analyze/{username}/{repo_name}")
async def analyze_single_repository(
    username: str,
    repo_name: str,
    github_service: GitHubService = Depends(get_github_service),
    analyzer: AnalyzerService = Depends(get_analyzer_service),
):
    """
    Analyze a single specific GitHub repository by username and repo name.
    Fetches real-time live data instead of using cached or mocked data.
    """
    if not validate_github_username(username):
        raise HTTPException(status_code=400, detail="Invalid GitHub username")
    if not validate_github_repo_name(repo_name):
        raise HTTPException(status_code=400, detail="Invalid repository name")

    try:
        repo_data = await github_service.get_repository_details(username, repo_name)
    except UpstreamNotFoundError:
        raise HTTPException(status_code=404, detail="Repository not found or access denied")

    repo_analysis = await analyzer.analyze_repository(repo_data)
    readme = await github_service.get_readme_content(username, repo_name)

    return {"analysis": repo_analysis, "raw_readme": readme}

@router.get("/user/{username}/basic")
async def get_basic_profile(
    username: str, github_service: GitHubService = Depends(get_github_service)
):
    """
    Get basic GitHub profile information
    """
    if not validate_github_username(username):
        raise HTTPException(status_code=400, detail="Invalid GitHub username")
    return await github_service.get_user_profile(username)
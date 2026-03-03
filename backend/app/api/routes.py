from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from pydantic import BaseModel


from ..services.github_service import GitHubService
from ..services.analyzer_service import AnalyzerService
from ..services.score_calculator import ScoreCalculator
from ..services.recruiter_simulator import RecruiterSimulator
from ..services.roadmap_generator import RoadmapGenerator
from ..models.user_profile import UserProfile
from ..utils.helpers import validate_github_username
from ..config import Config

class ScoreRequest(BaseModel):
    user_data: Dict[str, Any]
    repositories: List[Dict[str, Any]]

router = APIRouter()

@router.get("/analyze/batch/{username}")
async def analyze_github_profile_batch(username: str, page: int = 1, limit: int = 20):
    """
    Analyze a GitHub profile in paginated batches
    """
    try:
        if not validate_github_username(username):
            raise HTTPException(status_code=400, detail="Invalid GitHub username")
        
        github_service = GitHubService()
        analyzer = AnalyzerService()
        
        # Fetch GitHub data
        user_data = await github_service.get_user_profile(username)
        repositories = await github_service.get_repositories(username)
        total_repos = len(repositories)
        
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        batch_repos = repositories[start_idx:end_idx]
        
        # Analyze each repository in this batch
        analyzed_repos = []
        for repo in batch_repos:
            repo_analysis = await analyzer.analyze_repository(repo)
            analyzed_repos.append(repo_analysis)
            
        return {
            "user_data": user_data,
            "analyzed_repos": analyzed_repos,
            "total_repos": total_repos,
            "page": page,
            "has_more": end_idx < total_repos
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/score")
async def calculate_cumulative_score(request: ScoreRequest):
    """
    Calculate portfolio score using accumulated repositories from multiple pages
    """
    try:
        score_calculator = ScoreCalculator()
        recruiter_sim = RecruiterSimulator()
        roadmap_gen = RoadmapGenerator()
        
        portfolio_score = score_calculator.calculate_portfolio_score(
            request.user_data, request.repositories
        )
        recruiter_feedback = recruiter_sim.simulate_review(
            request.user_data, request.repositories, portfolio_score
        )
        roadmap = roadmap_gen.generate_roadmap(
            portfolio_score, request.repositories
        )
        
        return {
            "score": portfolio_score,
            "recruiter_feedback": recruiter_feedback,
            "roadmap": roadmap
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analyze/{username}")
async def analyze_github_profile(username: str):
    """
    Analyze a GitHub profile and return comprehensive portfolio analysis
    """
    try:
        # Validate username
        if not validate_github_username(username):
            raise HTTPException(status_code=400, detail="Invalid GitHub username")
        
        # Initialize services
        github_service = GitHubService()
        analyzer = AnalyzerService()
        score_calculator = ScoreCalculator()
        recruiter_sim = RecruiterSimulator()
        roadmap_gen = RoadmapGenerator()
        
        # Fetch GitHub data
        user_data = await github_service.get_user_profile(username)
        repositories = await github_service.get_repositories(username)
        
        # Limit repositories for performance
        repositories = repositories[:Config.MAX_REPOS_TO_ANALYZE]
        
        # Analyze each repository
        analyzed_repos = []
        for repo in repositories:
            repo_analysis = await analyzer.analyze_repository(repo)
            analyzed_repos.append(repo_analysis)
        
        # Calculate scores
        portfolio_score = score_calculator.calculate_portfolio_score(
            user_data, analyzed_repos
        )
        
        # Generate recruiter feedback
        recruiter_feedback = recruiter_sim.simulate_review(
            user_data, analyzed_repos, portfolio_score
        )
        
        # Generate improvement roadmap
        roadmap = roadmap_gen.generate_roadmap(
            portfolio_score, analyzed_repos
        )
        
        # Create user profile
        profile = UserProfile(
            username=username,
            user_data=user_data,
            repositories=analyzed_repos,
            score=portfolio_score,
            recruiter_feedback=recruiter_feedback,
            roadmap=roadmap
        )
        
        return profile.dict()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analyze/{username}/{repo_name}")
async def analyze_single_repository(username: str, repo_name: str):
    """
    Analyze a single specific GitHub repository by username and repo name.
    Fetches real-time live data instead of using cached or mocked data.
    """
    try:
        if not validate_github_username(username):
            raise HTTPException(status_code=400, detail="Invalid GitHub username")
            
        github_service = GitHubService()
        analyzer = AnalyzerService()
        
        # Ensure we can actually access this repository
        try:
            repo_data = await github_service.get_repository_details(username, repo_name)
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Repository not found or access denied: {str(e)}")
            
        # Perform live analysis
        repo_analysis = await analyzer.analyze_repository(repo_data)
        
        # Additionally fetch raw contents like README for display
        readme = await github_service.get_readme_content(username, repo_name)
        
        return {
            "analysis": repo_analysis,
            "raw_readme": readme
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{username}/basic")
async def get_basic_profile(username: str):
    """
    Get basic GitHub profile information
    """
    try:
        github_service = GitHubService()
        user_data = await github_service.get_user_profile(username)
        return user_data
    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))

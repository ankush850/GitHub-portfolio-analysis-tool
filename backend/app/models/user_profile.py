from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field

class UserProfile(BaseModel):
    """User profile model"""
    model_config = ConfigDict(from_attributes=True)

    username: str
    user_data: Dict[str, Any]
    repositories: List[Dict[str, Any]]
    score: Dict[str, Any]
    recruiter_feedback: Dict[str, Any]
    roadmap: Dict[str, Any]
    analyzed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Repository(BaseModel):
    """Repository model"""
    model_config = ConfigDict(from_attributes=True)

    name: str
    full_name: str
    description: Optional[str]
    url: str
    stars: int
    forks: int
    open_issues: int
    created_at: str
    updated_at: str
    languages: Dict[str, int]
    documentation_analysis: Dict[str, Any]
    code_analysis: Dict[str, Any]
    activity_analysis: Dict[str, Any]
    score: Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]
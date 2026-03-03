import httpx
from typing import Dict, List, Any
from ..config import Settings
from ..errors import UpstreamNotFoundError, UpstreamServiceError

class GitHubService:
    def __init__(self, *, settings: Settings, client: httpx.AsyncClient):
        self._settings = settings
        self.base_url = str(settings.GITHUB_API_BASE_URL).rstrip("/")
        self.client = client
    
    async def get_user_profile(self, username: str) -> Dict[str, Any]:
        """Fetch user profile information"""
        try:
            response = await self.client.get(
                f"{self.base_url}/users/{username}"
            )
            response.raise_for_status()
            data = response.json()
            
            # Get additional contribution data
            events = await self.get_user_events(username)
            
            return {
                "login": data["login"],
                "name": data["name"],
                "bio": data["bio"],
                "public_repos": data["public_repos"],
                "followers": data["followers"],
                "following": data["following"],
                "created_at": data["created_at"],
                "updated_at": data["updated_at"],
                "avatar_url": data["avatar_url"],
                "html_url": data["html_url"],
                "recent_activity": len(events) if events else 0
            }
        except httpx.HTTPError as e:
            if isinstance(e, httpx.HTTPStatusError) and e.response is not None and e.response.status_code == 404:
                raise UpstreamNotFoundError("GitHub resource not found") from e
            raise UpstreamServiceError("GitHub API error") from e
    
    async def get_repositories(self, username: str) -> List[Dict[str, Any]]:
        """Fetch all public repositories for a user"""
        try:
            response = await self.client.get(
                f"{self.base_url}/users/{username}/repos",
                params={"sort": "updated", "per_page": 100}
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            if isinstance(e, httpx.HTTPStatusError) and e.response is not None and e.response.status_code == 404:
                raise UpstreamNotFoundError("GitHub resource not found") from e
            raise UpstreamServiceError("GitHub API error") from e
    
    async def get_repository_details(self, username: str, repo_name: str) -> Dict[str, Any]:
        """Fetch detailed repository information"""
        try:
            response = await self.client.get(
                f"{self.base_url}/repos/{username}/{repo_name}"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            if isinstance(e, httpx.HTTPStatusError) and e.response is not None and e.response.status_code == 404:
                raise UpstreamNotFoundError("GitHub resource not found") from e
            raise UpstreamServiceError("GitHub API error") from e
    
    async def get_readme_content(self, username: str, repo_name: str) -> str:
        """Fetch README content for a repository"""
        try:
            response = await self.client.get(
                f"{self.base_url}/repos/{username}/{repo_name}/readme"
            )
            if response.status_code == 404:
                return ""
            
            response.raise_for_status()
            data = response.json()
            
            # Decode content from base64
            import base64
            content = base64.b64decode(data["content"]).decode("utf-8")
            return content
        except Exception:
            return ""
    
    async def get_languages(self, username: str, repo_name: str) -> Dict[str, int]:
        """Fetch languages used in a repository"""
        try:
            response = await self.client.get(
                f"{self.base_url}/repos/{username}/{repo_name}/languages"
            )
            response.raise_for_status()
            return response.json()
        except Exception:
            return {}
    
    async def get_commits(self, username: str, repo_name: str) -> List[Dict[str, Any]]:
        """Fetch recent commits for a repository"""
        try:
            response = await self.client.get(
                f"{self.base_url}/repos/{username}/{repo_name}/commits",
                params={"per_page": 30}
            )
            response.raise_for_status()
            return response.json()
        except Exception:
            return []
    
    async def get_user_events(self, username: str) -> List[Dict[str, Any]]:
        """Fetch user events for activity analysis"""
        try:
            response = await self.client.get(
                f"{self.base_url}/users/{username}/events",
                params={"per_page": 30}
            )
            response.raise_for_status()
            return response.json()
        except Exception:
            return []
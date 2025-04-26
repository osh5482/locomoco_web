"""
__init__.py - API 패키지 초기화
locomoco 포트폴리오 웹사이트
"""

from app.routers.api import language
from app.routers.api.admin import about, work, profile

__all__ = ["language", "about", "work", "profile"]

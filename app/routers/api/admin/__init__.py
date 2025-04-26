"""
__init__.py - 관리자 API 패키지 초기화
locomoco 포트폴리오 웹사이트
"""

from app.routers.api.admin import about, work, profile

__all__ = ["about", "work", "profile"]

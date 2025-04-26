"""
__init__.py - 미들웨어 패키지 초기화
locomoco 포트폴리오 웹사이트
"""

from app.middleware.stats import StatsMiddleware

__all__ = ["StatsMiddleware"]

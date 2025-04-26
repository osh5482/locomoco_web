"""
__init__.py - 모델 패키지 초기화
locomoco 포트폴리오 웹사이트
"""

# 모든 모델을 여기서 가져와서 다른 파일에서 쉽게 접근할 수 있도록 함
from app.database.models.base import Base
from app.database.models.language import Language, UITranslation
from app.database.models.about import AboutContent, ProfileImage
from app.database.models.work import WorkCategory, Work
from app.database.models.stats import SiteStats, ActivityLog

# 모든 모델을 하나의 리스트로 제공 (마이그레이션 등에 유용)
__all__ = [
    "Base",
    "Language",
    "UITranslation",
    "AboutContent",
    "ProfileImage",
    "WorkCategory",
    "Work",
    "SiteStats",
    "ActivityLog",
]

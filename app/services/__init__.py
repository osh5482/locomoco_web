"""
__init__.py - 서비스 패키지 초기화
locomoco 포트폴리오 웹사이트
"""

from app.services.language_service import get_language, get_translations, set_language
from app.services.about_service import (
    get_about_content,
    get_profile_image,
    update_about_content,
    update_profile_image,
)
from app.services.work_service import (
    get_all_works,
    get_work_by_id,
    get_work_detail,
    add_or_update_work,
    delete_work,
    add_work_gifs,
)
from app.services.stats_service import (
    get_dashboard_stats,
    get_visit_stats,
    add_activity_log,
)

__all__ = [
    # language_service
    "get_language",
    "get_translations",
    "set_language",
    # about_service
    "get_about_content",
    "get_profile_image",
    "update_about_content",
    "update_profile_image",
    # work_service
    "get_all_works",
    "get_work_by_id",
    "get_work_detail",
    "add_or_update_work",
    "delete_work",
    "add_work_gifs",
    # stats_service
    "get_dashboard_stats",
    "get_visit_stats",
    "add_activity_log",
]

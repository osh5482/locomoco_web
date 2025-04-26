"""
admin.py - 관리자 페이지 라우터
locomoco 포트폴리오 웹사이트
"""

from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pathlib import Path

from app.database.db import get_db
from app.utils.security import get_current_username
from app.services import (
    get_dashboard_stats,
    get_all_works,
    get_about_content,
    get_profile_image,
)

# 템플릿 디렉토리 설정
BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# 라우터 생성
router = APIRouter()


@router.get("/admin")
async def admin(
    request: Request,
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    관리자 페이지 렌더링 - 기본 인증 필요
    """
    # 대시보드 통계 데이터 가져오기
    stats = get_dashboard_stats(db)

    # 작품 목록
    works = get_all_works(db)

    # About 페이지 콘텐츠
    about_contents = {}
    for lang_code in ["ko", "ja", "en"]:
        content = get_about_content(db, lang_code)
        about_contents[lang_code] = content

    # 프로필 이미지
    profile_image = get_profile_image(db)

    return templates.TemplateResponse(
        "admin.html",
        {
            "request": request,
            "username": username,
            "total_works": stats["total_works"],
            "category_stats": stats["category_stats"],
            "visits_by_day": stats["visits_by_day"],
            "recent_activities": stats["recent_activities"],
            "works": works,
            "about_contents": about_contents,
            "profile_image": profile_image,
        },
    )

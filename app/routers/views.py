"""
views.py - 프론트엔드 페이지 라우터
locomoco 포트폴리오 웹사이트
"""

from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pathlib import Path

from app.database.db import get_db
from app.services import (
    get_translations,
    get_about_content,
    get_profile_image,
    get_all_works,
    get_work_detail,
)

# 템플릿 디렉토리 설정
BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# 라우터 생성
router = APIRouter()


@router.get("/")
async def index(request: Request, db: Session = Depends(get_db)):
    """
    메인 페이지 (About) 렌더링
    """
    # 기본 언어로 About 페이지 콘텐츠 조회
    lang_code = request.cookies.get("preferred_language", "ko")

    # About 페이지 콘텐츠 조회
    about_content = get_about_content(db, lang_code)

    # 현재 사용 중인 프로필 이미지 조회
    profile_image = get_profile_image(db)

    # 언어별 번역 데이터
    translations = get_translations(db, lang_code)

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "about_content": about_content,
            "profile_image": profile_image,
            "translations": translations,
            "current_lang": lang_code,
        },
    )


@router.get("/work")
async def work(request: Request, db: Session = Depends(get_db)):
    """
    작품 포트폴리오 페이지 렌더링
    """
    # 현재 언어 설정
    lang_code = request.cookies.get("preferred_language", "ko")

    # 활성화된 작품만 표시
    works = get_all_works(db, active_only=True)

    # 언어별 번역 데이터
    translations = get_translations(db, lang_code)

    return templates.TemplateResponse(
        "work.html",
        {
            "request": request,
            "works": works,
            "translations": translations,
            "current_lang": lang_code,
        },
    )


@router.get("/work/{work_id}")
async def work_detail(work_id: int, request: Request, db: Session = Depends(get_db)):
    """
    작품 상세 페이지 렌더링
    """
    # 현재 언어 설정
    lang_code = request.cookies.get("preferred_language", "ko")

    try:
        # 작품 상세 정보 조회
        detail = get_work_detail(db, work_id)
    except HTTPException:
        # 작품이 존재하지 않으면 목록 페이지로 리다이렉트
        return RedirectResponse(url="/work", status_code=303)

    # 언어별 번역 데이터
    translations = get_translations(db, lang_code)

    return templates.TemplateResponse(
        "work_detail.html",
        {
            "request": request,
            "work": detail["work"],
            "category": detail["category"],
            "related_works": detail["related_works"],
            "gifs": detail["gifs"],  # GIF 이미지 목록 전달
            "translations": translations,
            "current_lang": lang_code,
        },
    )


@router.get("/contact")
async def contact(request: Request, db: Session = Depends(get_db)):
    """
    연락처 페이지 렌더링
    """
    # 현재 언어 설정
    lang_code = request.cookies.get("preferred_language", "ko")

    # 언어별 번역 데이터
    translations = get_translations(db, lang_code)

    return templates.TemplateResponse(
        "contact.html",
        {"request": request, "translations": translations, "current_lang": lang_code},
    )

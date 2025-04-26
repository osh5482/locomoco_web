"""
about.py - About 페이지 관리자 API 라우터
locomoco 포트폴리오 웹사이트
"""

from fastapi import APIRouter, Depends, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.utils.security import get_current_username
from app.services import update_about_content

router = APIRouter()


@router.post("/about")
async def update_about_api(
    biography_title: str = Form(...),
    biography_content: str = Form(...),
    video_desc_title: str = Form(...),
    video_desc_content: str = Form(...),
    lang_code: str = Form(...),
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    About 페이지 콘텐츠 업데이트 API

    Args:
        biography_title: 약력 제목
        biography_content: 약력 내용
        video_desc_title: 영상 설명 제목
        video_desc_content: 영상 설명 내용
        lang_code: 언어 코드
        username: 인증된 관리자 사용자명
        db: 데이터베이스 세션

    Returns:
        JSONResponse: 업데이트 결과
    """
    result = update_about_content(
        db=db,
        lang_code=lang_code,
        biography_title=biography_title,
        biography_content=biography_content,
        video_desc_title=video_desc_title,
        video_desc_content=video_desc_content,
    )

    return JSONResponse(content=result)

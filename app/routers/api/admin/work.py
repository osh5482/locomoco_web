"""
work.py - 작품 관리자 API 라우터
locomoco 포트폴리오 웹사이트
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, Form, File, UploadFile, Path
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.utils.security import get_current_username
from app.services import get_work_by_id, add_or_update_work, delete_work, add_work_gifs

router = APIRouter()


@router.get("/work/{work_id}")
async def get_work_api(
    work_id: int = Path(...),
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    작품 정보 조회 API

    Args:
        work_id: 작품 ID
        username: 인증된 관리자 사용자명
        db: 데이터베이스 세션

    Returns:
        JSONResponse: 작품 정보
    """
    # 작품 조회
    work = get_work_by_id(db, work_id)

    if not work:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "해당 작품을 찾을 수 없습니다."},
        )

    # 카테고리 슬러그 가져오기
    category_slug = work.category.slug if work.category else "cover"

    # 작품 정보 반환
    return JSONResponse(
        content={
            "status": "success",
            "work": {
                "id": work.id,
                "title": work.title,
                "artist": work.artist,
                "category": category_slug,
                "year": work.year,
                "youtube_url": work.youtube_url,
                "thumbnail_path": work.thumbnail_path,
                "description": work.description,
                "is_active": work.is_active,
            },
        }
    )


@router.post("/work")
async def add_or_update_work_api(
    work_id: Optional[int] = Form(None),
    title: str = Form(...),
    artist: Optional[str] = Form(None),
    category: str = Form(...),
    year: int = Form(...),
    youtube_url: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    is_active: bool = Form(True),
    thumbnail: Optional[UploadFile] = File(None),
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    작품 추가 또는 수정 API

    Args:
        work_id: 수정할 작품 ID (없으면 신규 추가)
        title: 작품 제목
        artist: 아티스트 이름
        category: 카테고리 슬러그
        year: 제작 연도
        youtube_url: 유튜브 URL
        description: 작품 설명
        is_active: 활성화 여부
        thumbnail: 썸네일 이미지 파일
        username: 인증된 관리자 사용자명
        db: 데이터베이스 세션

    Returns:
        JSONResponse: 추가/수정 결과
    """
    result = add_or_update_work(
        db=db,
        title=title,
        artist=artist,
        category=category,
        year=year,
        youtube_url=youtube_url,
        description=description,
        is_active=is_active,
        thumbnail=thumbnail,
        work_id=work_id,
    )

    return JSONResponse(content=result)


@router.delete("/work/{work_id}")
async def delete_work_api(
    work_id: int = Path(...),
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    작품 삭제 API

    Args:
        work_id: 삭제할 작품 ID
        username: 인증된 관리자 사용자명
        db: 데이터베이스 세션

    Returns:
        JSONResponse: 삭제 결과
    """
    result = delete_work(db=db, work_id=work_id)
    return JSONResponse(content=result)


@router.post("/work/{work_id}/gifs")
async def upload_work_gifs_api(
    work_id: int = Path(...),
    gif_files: List[UploadFile] = File(...),
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    작품 GIF 이미지 업로드 API

    Args:
        work_id: 작품 ID
        gif_files: GIF 이미지 파일 리스트 (최대 4개)
        username: 인증된 관리자 사용자명
        db: 데이터베이스 세션

    Returns:
        JSONResponse: 업로드 결과
    """
    result = add_work_gifs(db=db, work_id=work_id, gif_files=gif_files)
    return JSONResponse(content=result)

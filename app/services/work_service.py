"""
work_service.py - 작품 관련 서비스
locomoco 포트폴리오 웹사이트
"""

from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException

from app.database.models import Work, WorkCategory, WorkGif, ActivityLog
from app.utils.file_handling import save_thumbnail, save_multiple_work_gifs


def get_all_works(db: Session, active_only: bool = False) -> List[Work]:
    """
    모든 작품 목록 조회

    Args:
        db: 데이터베이스 세션
        active_only: 활성화된 작품만 가져올지 여부

    Returns:
        list: 작품 목록
    """
    query = db.query(Work)

    if active_only:
        query = query.filter(Work.is_active == True)

    return query.order_by(Work.order).all()


def get_work_by_id(db: Session, work_id: int) -> Optional[Work]:
    """
    ID로 작품 조회

    Args:
        db: 데이터베이스 세션
        work_id: 작품 ID

    Returns:
        Work: 작품 모델
    """
    return db.query(Work).filter(Work.id == work_id).first()


def get_work_gifs(db: Session, work_id: int) -> List[WorkGif]:
    """
    작품의 GIF 이미지 조회

    Args:
        db: 데이터베이스 세션
        work_id: 작품 ID

    Returns:
        list: 작품 GIF 목록
    """
    return (
        db.query(WorkGif)
        .filter(WorkGif.work_id == work_id)
        .order_by(WorkGif.position)
        .all()
    )


def get_related_works(db: Session, work_id: int, limit: int = 4) -> List[Work]:
    """
    관련 작품 조회

    Args:
        db: 데이터베이스 세션
        work_id: 현재 작품 ID
        limit: 반환할 작품 수

    Returns:
        list: 관련 작품 목록
    """
    # 현재 작품 조회
    current_work = get_work_by_id(db, work_id)

    if not current_work:
        return []

    # 동일 카테고리의 작품들 (현재 작품 제외)
    related_works = (
        db.query(Work)
        .filter(
            Work.category_id == current_work.category_id,
            Work.id != work_id,
            Work.is_active == True,
        )
        .order_by(Work.order)
        .limit(limit)
        .all()
    )

    # 관련 작품이 부족하면 다른 카테고리 작품으로 보충
    if len(related_works) < limit:
        more_works = (
            db.query(Work)
            .filter(
                Work.category_id != current_work.category_id,
                Work.id != work_id,
                Work.is_active == True,
            )
            .order_by(Work.order)
            .limit(limit - len(related_works))
            .all()
        )
        related_works.extend(more_works)

    return related_works


def get_work_detail(db: Session, work_id: int) -> Dict[str, Any]:
    """
    작품 상세 정보 조회

    Args:
        db: 데이터베이스 세션
        work_id: 작품 ID

    Returns:
        dict: 작품 상세 정보
    """
    # 작품 정보 조회
    work = get_work_by_id(db, work_id)

    if not work:
        raise HTTPException(status_code=404, detail="작품을 찾을 수 없습니다")

    # 카테고리 정보 조회
    category = (
        db.query(WorkCategory).filter(WorkCategory.id == work.category_id).first()
    )

    # 관련 작품 조회
    related_works = get_related_works(db, work_id)

    # GIF 이미지 조회
    gifs = get_work_gifs(db, work_id)

    return {
        "work": work,
        "category": category,
        "related_works": related_works,
        "gifs": gifs,
    }


def add_or_update_work(
    db: Session,
    title: str,
    category: str,
    year: int,
    artist: Optional[str] = None,
    youtube_url: Optional[str] = None,
    description: Optional[str] = None,
    is_active: bool = True,
    thumbnail: Optional[UploadFile] = None,
    work_id: Optional[int] = None,
) -> Dict[str, Any]:
    """
    작품 추가 또는 수정

    Args:
        db: 데이터베이스 세션
        title: 작품 제목
        category: 카테고리 슬러그
        year: 제작 연도
        artist: 아티스트 이름
        youtube_url: 유튜브 URL
        description: 작품 설명
        is_active: 활성화 여부
        thumbnail: 썸네일 이미지 파일
        work_id: 수정할 작품 ID (없으면 신규 생성)

    Returns:
        dict: 응답 메시지
    """
    try:
        # 카테고리 ID 조회
        category_obj = (
            db.query(WorkCategory).filter(WorkCategory.slug == category).first()
        )
        if not category_obj:
            raise HTTPException(status_code=400, detail="잘못된 카테고리입니다.")

        # 썸네일 이미지 처리
        thumbnail_filename = None
        thumbnail_path = None

        if thumbnail and thumbnail.filename:
            thumbnail_filename, thumbnail_path = save_thumbnail(thumbnail, title)

        # 작품 ID가 있으면 수정, 없으면 새로 추가
        if work_id:
            # 기존 작품 조회
            work = get_work_by_id(db, work_id)

            if not work:
                raise HTTPException(
                    status_code=404, detail="해당 작품을 찾을 수 없습니다."
                )

            # 작품 정보 업데이트
            work.title = title
            work.artist = artist
            work.category_id = category_obj.id
            work.year = year
            work.youtube_url = youtube_url
            work.description = description
            work.is_active = is_active
            work.updated_at = datetime.now()

            # 썸네일 이미지가 업로드된 경우에만 업데이트
            if thumbnail_filename and thumbnail_path:
                work.thumbnail_filename = thumbnail_filename
                work.thumbnail_path = thumbnail_path

            action = "update"
            message = "작품이 업데이트되었습니다."

        else:
            # 최대 순서 값 조회
            max_order = db.query(Work).order_by(Work.order.desc()).first()
            new_order = 1
            if max_order:
                new_order = max_order.order + 1

            # 새 작품 생성
            work = Work(
                title=title,
                artist=artist,
                category_id=category_obj.id,
                year=year,
                youtube_url=youtube_url,
                thumbnail_filename=thumbnail_filename,
                thumbnail_path=thumbnail_path,
                description=description,
                is_active=is_active,
                order=new_order,
            )
            db.add(work)

            action = "create"
            message = "새 작품이 추가되었습니다."

        # 커밋하여 작품 ID 생성
        db.commit()

        # 활동 로그 기록
        log = ActivityLog(
            action=action,
            entity_type="work",
            entity_id=work.id,
            description=f"작품 '{title}' {action}",
        )
        db.add(log)

        db.commit()

        return {"status": "success", "message": message, "work_id": work.id}

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"오류가 발생했습니다: {str(e)}")


def delete_work(db: Session, work_id: int) -> Dict[str, Any]:
    """
    작품 삭제

    Args:
        db: 데이터베이스 세션
        work_id: 삭제할 작품 ID

    Returns:
        dict: 응답 메시지
    """
    try:
        # 작품 조회
        work = get_work_by_id(db, work_id)

        if not work:
            raise HTTPException(status_code=404, detail="해당 작품을 찾을 수 없습니다.")

        # 작품 제목 저장 (로그용)
        work_title = work.title

        # 작품 삭제 (관련된 GIF 이미지도 cascade로 삭제됨)
        db.delete(work)

        # 활동 로그 기록
        log = ActivityLog(
            action="delete",
            entity_type="work",
            entity_id=work_id,
            description=f"작품 '{work_title}' 삭제",
        )
        db.add(log)

        db.commit()

        return {"status": "success", "message": "작품이 삭제되었습니다."}

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"오류가 발생했습니다: {str(e)}")


def add_work_gifs(
    db: Session, work_id: int, gif_files: List[UploadFile]
) -> Dict[str, Any]:
    """
    작품에 GIF 이미지 추가

    Args:
        db: 데이터베이스 세션
        work_id: 작품 ID
        gif_files: GIF 이미지 파일 리스트 (최대 4개)

    Returns:
        dict: 응답 메시지
    """
    try:
        # 작품 존재 여부 확인
        work = get_work_by_id(db, work_id)
        if not work:
            raise HTTPException(status_code=404, detail="해당 작품을 찾을 수 없습니다.")

        # 기존 GIF 이미지 삭제
        db.query(WorkGif).filter(WorkGif.work_id == work_id).delete()

        # 새 GIF 이미지 저장
        saved_gifs = save_multiple_work_gifs(gif_files, work_id)

        # 데이터베이스에 저장
        for filename, path, position in saved_gifs:
            gif = WorkGif(
                work_id=work_id, filename=filename, path=path, position=position
            )
            db.add(gif)

        # 활동 로그 기록
        log = ActivityLog(
            action="update",
            entity_type="work_gif",
            entity_id=work_id,
            description=f"작품 '{work.title}'의 GIF 이미지 {len(saved_gifs)}개 업데이트",
        )
        db.add(log)

        db.commit()

        return {
            "status": "success",
            "message": f"GIF 이미지 {len(saved_gifs)}개가 추가되었습니다.",
            "gifs": [
                {"position": position, "path": path} for _, path, position in saved_gifs
            ],
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"오류가 발생했습니다: {str(e)}")

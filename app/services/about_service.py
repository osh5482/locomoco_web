"""
about_service.py - About 페이지 관련 서비스
locomoco 포트폴리오 웹사이트
"""

from typing import Dict, Any, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException

from app.database.models import Language, AboutContent, ProfileImage, ActivityLog
from app.utils.file_handling import save_profile_image
from app.services.language_service import get_language


def get_about_content(db: Session, lang_code: str = None) -> Optional[AboutContent]:
    """
    언어 코드에 해당하는 About 페이지 콘텐츠 조회

    Args:
        db: 데이터베이스 세션
        lang_code: 언어 코드 (ko, ja, en)

    Returns:
        AboutContent: About 페이지 콘텐츠 모델
    """
    # 언어 모델 조회
    language = get_language(db, lang_code)

    # About 콘텐츠 조회
    about_content = (
        db.query(AboutContent).filter(AboutContent.language_id == language.id).first()
    )

    return about_content


def get_profile_image(db: Session) -> Optional[ProfileImage]:
    """
    현재 사용 중인 프로필 이미지 조회

    Args:
        db: 데이터베이스 세션

    Returns:
        ProfileImage: 프로필 이미지 모델
    """
    # 현재 사용 중인 프로필 이미지 조회
    profile_image = (
        db.query(ProfileImage).filter(ProfileImage.is_current == True).first()
    )

    return profile_image


def update_about_content(
    db: Session,
    lang_code: str,
    biography_title: str,
    biography_content: str,
    video_desc_title: str,
    video_desc_content: str,
) -> Dict[str, Any]:
    """
    About 페이지 콘텐츠 업데이트

    Args:
        db: 데이터베이스 세션
        lang_code: 언어 코드
        biography_title: 약력 제목
        biography_content: 약력 내용
        video_desc_title: 영상 설명 제목
        video_desc_content: 영상 설명 내용

    Returns:
        dict: 응답 메시지
    """
    try:
        # 언어 ID 조회
        language = get_language(db, lang_code)

        # 기존 콘텐츠 조회
        about_content = (
            db.query(AboutContent)
            .filter(AboutContent.language_id == language.id)
            .first()
        )

        # 업데이트 또는 새로 생성
        if about_content:
            about_content.biography_title = biography_title
            about_content.biography_content = biography_content
            about_content.video_desc_title = video_desc_title
            about_content.video_desc_content = video_desc_content
            about_content.updated_at = datetime.now()
        else:
            new_content = AboutContent(
                language_id=language.id,
                biography_title=biography_title,
                biography_content=biography_content,
                video_desc_title=video_desc_title,
                video_desc_content=video_desc_content,
            )
            db.add(new_content)

        # 활동 로그 기록
        log = ActivityLog(
            action="update",
            entity_type="about",
            entity_id=language.id,
            description=f"About 페이지 {language.name} 내용 업데이트",
        )
        db.add(log)

        db.commit()

        return {
            "status": "success",
            "message": f"{language.name} About 페이지가 업데이트되었습니다.",
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"오류가 발생했습니다: {str(e)}")


def update_profile_image(db: Session, profile_image: UploadFile) -> Dict[str, Any]:
    """
    프로필 이미지 업데이트

    Args:
        db: 데이터베이스 세션
        profile_image: 업로드된 프로필 이미지 파일

    Returns:
        dict: 응답 메시지
    """
    try:
        # 이미지 파일 저장
        filename, path = save_profile_image(profile_image)

        # 이전 프로필 이미지 비활성화
        old_profiles = (
            db.query(ProfileImage).filter(ProfileImage.is_current == True).all()
        )
        for old_profile in old_profiles:
            old_profile.is_current = False

        # 새 프로필 이미지 저장
        new_profile = ProfileImage(
            filename=filename,
            path=path,
            is_current=True,
        )
        db.add(new_profile)

        # 활동 로그 기록
        log = ActivityLog(
            action="update", entity_type="profile", description="프로필 이미지 업데이트"
        )
        db.add(log)

        db.commit()

        return {
            "status": "success",
            "message": "프로필 이미지가 업데이트되었습니다.",
            "image_path": path,
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"오류가 발생했습니다: {str(e)}")

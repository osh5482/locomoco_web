"""
file_handling.py - 파일 처리 관련 유틸리티
locomoco 포트폴리오 웹사이트
"""

import os
import shutil
from pathlib import Path
from datetime import datetime
from typing import Tuple, Optional, List
from fastapi import UploadFile, HTTPException
import imghdr

from app.config import config, paths


def validate_image(file: UploadFile) -> None:
    """
    업로드된 파일이 유효한 이미지인지 검증

    Args:
        file: 업로드된 파일

    Raises:
        HTTPException: 유효하지 않은 파일 형식인 경우
    """
    # 파일 확장자 확인
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in config["ALLOWED_EXTENSIONS"]:
        raise HTTPException(
            status_code=400,
            detail=f"허용되지 않는 파일 형식입니다. 지원 형식: {', '.join(config['ALLOWED_EXTENSIONS'])}",
        )

    # 파일 내용 일부를 읽어 이미지 형식 확인
    contents = file.file.read(1024)
    file.file.seek(0)  # 파일 포인터 원위치

    image_type = imghdr.what(None, contents)
    if image_type not in ["jpeg", "png", "gif"]:
        raise HTTPException(status_code=400, detail="유효한 이미지 파일이 아닙니다.")


def save_profile_image(file: UploadFile) -> Tuple[str, str]:
    """
    프로필 이미지 저장

    Args:
        file: 업로드된 이미지 파일

    Returns:
        tuple: (파일명, 파일 경로)
    """
    # 이미지 유효성 검증
    validate_image(file)

    # 파일 확장자 가져오기
    file_ext = os.path.splitext(file.filename)[1].lower()

    # 파일명 생성 (현재 시간 기반)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"locomoco_profile_{timestamp}{file_ext}"
    file_path = paths["profile_dir"] / filename

    # 파일 저장
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 웹에서 접근 가능한 경로 반환
    return filename, f"/static/assets/images/profile/{filename}"


def save_thumbnail(file: UploadFile, title: Optional[str] = None) -> Tuple[str, str]:
    """
    작품 썸네일 이미지 저장

    Args:
        file: 업로드된 이미지 파일
        title: 작품 제목 (파일명에 사용)

    Returns:
        tuple: (파일명, 파일 경로)
    """
    # 이미지 유효성 검증
    validate_image(file)

    # 파일 확장자 가져오기
    file_ext = os.path.splitext(file.filename)[1].lower()

    # 파일명 생성 (작품 제목과 현재 시간 기반)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    if title:
        # 특수문자 및 공백 처리
        sanitized_title = "".join(c if c.isalnum() else "_" for c in title)
        sanitized_title = sanitized_title[:30]  # 제목이 너무 길면 자르기
        filename = f"thumb_{sanitized_title}_{timestamp}{file_ext}"
    else:
        filename = f"thumb_{timestamp}{file_ext}"

    file_path = paths["portfolio_dir"] / filename

    # 파일 저장
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 웹에서 접근 가능한 경로 반환
    return filename, f"/static/assets/images/portfolio/{filename}"


def save_work_gif(file: UploadFile, work_id: int, position: int) -> Tuple[str, str]:
    """
    작품 GIF 이미지 저장

    Args:
        file: 업로드된 GIF 파일
        work_id: 작품 ID
        position: 그리드 위치 (0, 1, 2, 3)

    Returns:
        tuple: (파일명, 파일 경로)
    """
    # 이미지 유효성 검증
    validate_image(file)

    # 파일 확장자 가져오기 (GIF 또는 다른 이미지 형식 허용)
    file_ext = os.path.splitext(file.filename)[1].lower()

    # 파일명 생성
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"gif_work_{work_id}_pos_{position}_{timestamp}{file_ext}"

    # GIF 디렉토리 확인 및 생성
    gif_dir = paths["portfolio_dir"] / "gifs"
    gif_dir.mkdir(parents=True, exist_ok=True)

    file_path = gif_dir / filename

    # 파일 저장
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 웹에서 접근 가능한 경로 반환
    return filename, f"/static/assets/images/portfolio/gifs/{filename}"


def save_multiple_work_gifs(
    files: List[UploadFile], work_id: int
) -> List[Tuple[str, str, int]]:
    """
    여러 개의 GIF 이미지 저장

    Args:
        files: 업로드된 GIF 파일 리스트
        work_id: 작품 ID

    Returns:
        list: [(파일명, 파일 경로, 위치 인덱스)] 형태의 리스트
    """
    results = []

    # 최대 4개까지만 처리
    for i, file in enumerate(files[:4]):
        if file and file.filename:
            filename, path = save_work_gif(file, work_id, i)
            results.append((filename, path, i))

    return results

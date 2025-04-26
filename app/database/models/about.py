"""
about.py - About 페이지 관련 모델
locomoco 포트폴리오 웹사이트
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.models.base import Base


class AboutContent(Base):
    """About 페이지 콘텐츠 테이블"""

    __tablename__ = "about_contents"

    id = Column(Integer, primary_key=True)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    biography_title = Column(String(100), nullable=False)
    biography_content = Column(Text, nullable=False)
    video_desc_title = Column(String(100), nullable=False)
    video_desc_content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # 관계 정의
    language = relationship("Language", back_populates="about_contents")

    def __repr__(self):
        return f"<AboutContent(language_id={self.language_id}, biography_title='{self.biography_title}')>"


class ProfileImage(Base):
    """프로필 이미지 테이블"""

    __tablename__ = "profile_images"

    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    path = Column(String(255), nullable=False)
    is_current = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)

    def __repr__(self):
        return (
            f"<ProfileImage(filename='{self.filename}', is_current={self.is_current})>"
        )

"""
work.py - 작품 관련 모델 업데이트: GIF 이미지 모델 추가
locomoco 포트폴리오 웹사이트
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.models.base import Base


class WorkCategory(Base):
    """작품 카테고리 테이블"""

    __tablename__ = "work_categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    slug = Column(String(50), unique=True, nullable=False)

    # 관계 정의
    works = relationship("Work", back_populates="category")

    def __repr__(self):
        return f"<WorkCategory(name='{self.name}', slug='{self.slug}')>"


class Work(Base):
    """작품 테이블"""

    __tablename__ = "works"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    artist = Column(String(100))
    category_id = Column(Integer, ForeignKey("work_categories.id"), nullable=False)
    year = Column(Integer, nullable=False)
    youtube_url = Column(String(255))
    thumbnail_filename = Column(String(255))
    thumbnail_path = Column(String(255))
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # 관계 정의
    category = relationship("WorkCategory", back_populates="works")
    gifs = relationship("WorkGif", back_populates="work", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Work(title='{self.title}', year={self.year})>"


class WorkGif(Base):
    """작품 GIF 이미지 테이블"""

    __tablename__ = "work_gifs"

    id = Column(Integer, primary_key=True)
    work_id = Column(Integer, ForeignKey("works.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    path = Column(String(255), nullable=False)
    position = Column(Integer, default=0)  # 0, 1, 2, 3 (2x2 그리드 위치)
    created_at = Column(DateTime, default=datetime.now)

    # 관계 정의
    work = relationship("Work", back_populates="gifs")

    def __repr__(self):
        return f"<WorkGif(work_id={self.work_id}, position={self.position})>"

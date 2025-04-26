"""
work.py - 작품 관련 모델
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

    def __repr__(self):
        return f"<Work(title='{self.title}', year={self.year})>"

"""
models.py - SQLAlchemy 모델 정의
locomoco 포트폴리오 웹사이트
"""

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    ForeignKey,
    DateTime,
    Date,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class Language(Base):
    """언어 테이블"""

    __tablename__ = "languages"

    id = Column(Integer, primary_key=True)
    code = Column(String(10), unique=True, nullable=False)  # 언어 코드 (ko, ja, en)
    name = Column(String(50), nullable=False)  # 언어 이름 (한국어, 日本語, English)

    # 관계 정의
    about_contents = relationship("AboutContent", back_populates="language")
    ui_translations = relationship("UITranslation", back_populates="language")

    def __repr__(self):
        return f"<Language(code='{self.code}', name='{self.name}')>"


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


class UITranslation(Base):
    """다국어 UI 텍스트 테이블"""

    __tablename__ = "ui_translations"

    id = Column(Integer, primary_key=True)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    key = Column(String(100), nullable=False)
    value = Column(Text, nullable=False)

    # 관계 정의
    language = relationship("Language", back_populates="ui_translations")

    def __repr__(self):
        return f"<UITranslation(language_id={self.language_id}, key='{self.key}')>"


class SiteStats(Base):
    """사이트 통계 테이블"""

    __tablename__ = "site_stats"

    id = Column(Integer, primary_key=True)
    visit_date = Column(Date, nullable=False)
    visit_count = Column(Integer, default=0)
    page_id = Column(String(50), nullable=False)

    def __repr__(self):
        return f"<SiteStats(visit_date='{self.visit_date}', page_id='{self.page_id}', visit_count={self.visit_count})>"


class ActivityLog(Base):
    """활동 로그 테이블"""

    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True)
    action = Column(String(50), nullable=False)  # create, update, delete
    entity_type = Column(String(50), nullable=False)  # about, work 등
    entity_id = Column(Integer)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    def __repr__(self):
        return f"<ActivityLog(action='{self.action}', entity_type='{self.entity_type}', description='{self.description}')>"

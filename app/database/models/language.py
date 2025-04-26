"""
language.py - 언어 관련 모델
locomoco 포트폴리오 웹사이트
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database.models.base import Base


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

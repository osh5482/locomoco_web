"""
seed.py - 초기 데이터 생성
locomoco 포트폴리오 웹사이트
"""

from sqlalchemy.orm import Session

from app.database.models import (
    Language,
    AboutContent,
    ProfileImage,
    WorkCategory,
    Work,
    UITranslation,
)


def create_initial_data(db: Session) -> None:
    """데이터베이스에 초기 데이터 삽입"""

    # 1. 언어 데이터 생성
    languages = [
        Language(code="ko", name="한국어"),
        Language(code="ja", name="日本語"),
        Language(code="en", name="English"),
    ]

    # 데이터베이스에 언어 추가
    for lang in languages:
        # 이미 존재하는지 확인
        existing_lang = db.query(Language).filter_by(code=lang.code).first()
        if not existing_lang:
            db.add(lang)

    db.commit()

    # 언어 ID 조회
    ko_lang = db.query(Language).filter_by(code="ko").first()
    ja_lang = db.query(Language).filter_by(code="ja").first()
    en_lang = db.query(Language).filter_by(code="en").first()

    # 2. About 페이지 콘텐츠 생성
    # 한국어 About 콘텐츠
    ko_about = db.query(AboutContent).filter_by(language_id=ko_lang.id).first()
    if not ko_about:
        ko_about = AboutContent(
            language_id=ko_lang.id,
            biography_title="약력",
            biography_content="""안녕하세요, locomoco입니다.

저는 다양한 장르의 커버 영상과 창작 영상을 제작하는 프리랜서 크리에이터입니다.

2018년부터 유튜브를 통해 작업물을 공유해왔으며, 특히 감성적인 영상 연출에 큰 관심을 가지고 있습니다.

현재까지 다양한 아티스트와 협업하여 50개 이상의 프로젝트를 완료했습니다.""",
            video_desc_title="제작 영상 소개",
            video_desc_content="""제가 주로 제작하는 영상은 다음과 같습니다:

• 노래 커버 영상 (뮤직비디오 스타일)
• 짧은 형식의 콘텐츠 (Youtube Shorts)
• 아티스트 프로모션 영상
• 감성적인 스토리텔링 영상

각 영상마다 아티스트의 개성과 곡의 분위기에 맞는 색감과 연출을 추구합니다.""",
        )
        db.add(ko_about)

    # 일본어 About 콘텐츠
    ja_about = db.query(AboutContent).filter_by(language_id=ja_lang.id).first()
    if not ja_about:
        ja_about = AboutContent(
            language_id=ja_lang.id,
            biography_title="経歴",
            biography_content="""こんにちは、locomocoです。

私は様々なジャンルのカバー映像と創作映像を制作するフリーランスクリエイターです。

2018年からYouTubeを通じて作品を共有してきており、特に感性的な映像演出に大きな関心を持っています。

現在まで様々なアーティストとコラボレーションし、50以上のプロジェクトを完了しました。""",
            video_desc_title="制作映像の紹介",
            video_desc_content="""私が主に制作している映像は次の通りです：

• 歌カバー映像（ミュージックビデオスタイル）
• ショート形式のコンテンツ（YouTube Shorts）
• アーティストプロモーション映像
• 感性的なストーリーテリング映像

各映像ごとにアーティストの個性と曲の雰囲気に合った色彩と演出を追求しています。""",
        )
        db.add(ja_about)

    # 영어 About 콘텐츠
    en_about = db.query(AboutContent).filter_by(language_id=en_lang.id).first()
    if not en_about:
        en_about = AboutContent(
            language_id=en_lang.id,
            biography_title="Biography",
            biography_content="""Hello, I'm locomoco.

I'm a freelance creator who produces cover videos and original content across various genres.

I've been sharing my work on YouTube since 2018, with a particular interest in emotional visual direction.

To date, I've completed over 50 projects in collaboration with various artists.""",
            video_desc_title="Video Production Introduction",
            video_desc_content="""Here are the types of videos I mainly produce:

• Song cover videos (music video style)
• Short-form content (YouTube Shorts)
• Artist promotion videos
• Emotional storytelling videos

For each video, I strive to create visuals and direction that match the artist's personality and the mood of the song.""",
        )
        db.add(en_about)

    # 3. 작품 카테고리 생성
    categories = [
        WorkCategory(name="커버 영상", slug="cover"),
        WorkCategory(name="쇼츠", slug="shorts"),
        WorkCategory(name="프로모션", slug="promotion"),
        WorkCategory(name="스토리텔링", slug="story"),
    ]

    for category in categories:
        existing_category = db.query(WorkCategory).filter_by(slug=category.slug).first()
        if not existing_category:
            db.add(category)

    db.commit()

    # 4. 프로필 이미지 초기 데이터
    profile_image = db.query(ProfileImage).filter_by(is_current=True).first()
    if not profile_image:
        profile_image = ProfileImage(
            filename="locomoco_main.jpg",
            path="/static/assets/images/profile/locomoco_main.jpg",
            is_current=True,
        )
        db.add(profile_image)

    # 5. UI 번역 데이터 생성
    _create_ui_translations(db, ko_lang, ja_lang, en_lang)

    # 6. 샘플 작품 데이터 생성
    _create_sample_works(db)

    db.commit()


def _create_ui_translations(
    db: Session, ko_lang: Language, ja_lang: Language, en_lang: Language
) -> None:
    """UI 번역 데이터 생성"""

    # 한국어 번역 데이터
    ko_translations = [
        {"key": "nav.about", "value": "ABOUT"},
        {"key": "nav.work", "value": "WORK"},
        {"key": "nav.contact", "value": "CONTACT"},
        {"key": "about.biography.title", "value": "약력"},
        {"key": "about.videoDesc.title", "value": "제작 영상 소개"},
        {"key": "work.title", "value": "WORK"},
        {"key": "work.loadMore", "value": "더 보기"},
        {"key": "work.back", "value": "모든 작품으로 돌아가기"},
        {"key": "work.artist", "value": "아티스트"},
        {"key": "work.description", "value": "작품 설명"},
        {"key": "work.related", "value": "관련 작품"},
        {"key": "contact.title", "value": "CONTACT"},
        {"key": "contact.form.name", "value": "이름"},
        {"key": "contact.form.email", "value": "이메일"},
        {"key": "contact.form.phone", "value": "연락처"},
        {"key": "contact.form.message", "value": "문의 내용"},
        {"key": "contact.form.submit", "value": "전송하기"},
        {
            "key": "contact.info",
            "value": "* 메일은 영업일 기준 24시간 이내에 회신드립니다.",
        },
    ]

    for trans in ko_translations:
        existing_trans = (
            db.query(UITranslation)
            .filter_by(language_id=ko_lang.id, key=trans["key"])
            .first()
        )
        if not existing_trans:
            db.add(
                UITranslation(
                    language_id=ko_lang.id, key=trans["key"], value=trans["value"]
                )
            )

    # 일본어 번역 데이터 추가
    ja_translations = [
        {"key": "nav.about", "value": "ABOUT"},
        {"key": "nav.work", "value": "WORK"},
        {"key": "nav.contact", "value": "CONTACT"},
        {"key": "work.title", "value": "WORK"},
        {"key": "work.loadMore", "value": "もっと見る"},
        {"key": "work.back", "value": "すべての作品に戻る"},
        {"key": "work.artist", "value": "アーティスト"},
        {"key": "work.description", "value": "作品説明"},
        {"key": "work.related", "value": "関連作品"},
        {"key": "contact.title", "value": "CONTACT"},
        {"key": "contact.form.name", "value": "名前"},
        {"key": "contact.form.email", "value": "メールアドレス"},
        {"key": "contact.form.phone", "value": "連絡先"},
        {"key": "contact.form.message", "value": "お問い合わせ内容"},
        {"key": "contact.form.submit", "value": "送信する"},
        {
            "key": "contact.info",
            "value": "* メールは営業日基準で24時間以内に返信いたします。",
        },
    ]

    for trans in ja_translations:
        existing_trans = (
            db.query(UITranslation)
            .filter_by(language_id=ja_lang.id, key=trans["key"])
            .first()
        )
        if not existing_trans:
            db.add(
                UITranslation(
                    language_id=ja_lang.id, key=trans["key"], value=trans["value"]
                )
            )

    # 영어 번역 데이터 추가
    en_translations = [
        {"key": "nav.about", "value": "ABOUT"},
        {"key": "nav.work", "value": "WORK"},
        {"key": "nav.contact", "value": "CONTACT"},
        {"key": "work.title", "value": "WORK"},
        {"key": "work.loadMore", "value": "More"},
        {"key": "work.back", "value": "Back to all works"},
        {"key": "work.artist", "value": "Artist"},
        {"key": "work.description", "value": "Description"},
        {"key": "work.related", "value": "Related Works"},
        {"key": "contact.title", "value": "CONTACT"},
        {"key": "contact.form.name", "value": "Name"},
        {"key": "contact.form.email", "value": "Email"},
        {"key": "contact.form.phone", "value": "Phone"},
        {"key": "contact.form.message", "value": "Message"},
        {"key": "contact.form.submit", "value": "Submit"},
        {
            "key": "contact.info",
            "value": "* Emails will be responded to within 24 hours on business days.",
        },
    ]

    for trans in en_translations:
        existing_trans = (
            db.query(UITranslation)
            .filter_by(language_id=en_lang.id, key=trans["key"])
            .first()
        )
        if not existing_trans:
            db.add(
                UITranslation(
                    language_id=en_lang.id, key=trans["key"], value=trans["value"]
                )
            )


def _create_sample_works(db: Session) -> None:
    """샘플 작품 데이터 생성"""

    # 카테고리 ID 조회
    cover_category = db.query(WorkCategory).filter_by(slug="cover").first()
    shorts_category = db.query(WorkCategory).filter_by(slug="shorts").first()

    # 샘플 작품이 없는 경우 생성
    work_count = db.query(Work).count()
    if work_count == 0:
        sample_works = [
            Work(
                title="작품 제목 1",
                artist="아티스트명",
                category_id=cover_category.id,
                year=2024,
                youtube_url="https://www.youtube.com/watch?v=sample1",
                thumbnail_filename="thumb_sample1.jpg",
                thumbnail_path="/static/assets/images/portfolio/thumb_sample1.jpg",
                description="작품 1에 대한 상세 설명입니다.",
                is_active=True,
                order=1,
            ),
            Work(
                title="작품 제목 2",
                artist="아티스트명",
                category_id=cover_category.id,
                year=2023,
                youtube_url="https://www.youtube.com/watch?v=sample2",
                thumbnail_filename="thumb_sample2.jpg",
                thumbnail_path="/static/assets/images/portfolio/thumb_sample2.jpg",
                description="작품 2에 대한 상세 설명입니다.",
                is_active=True,
                order=2,
            ),
            Work(
                title="작품 제목 3",
                artist="아티스트명",
                category_id=shorts_category.id,
                year=2023,
                youtube_url="https://www.youtube.com/watch?v=sample3",
                thumbnail_filename="thumb_sample3.jpg",
                thumbnail_path="/static/assets/images/portfolio/thumb_sample3.jpg",
                description="작품 3에 대한 상세 설명입니다.",
                is_active=True,
                order=3,
            ),
        ]

        for work in sample_works:
            db.add(work)

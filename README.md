# locomoco 포트폴리오 웹사이트

이 프로젝트는 비디오 프리랜서 locomoco의 포트폴리오 웹사이트로, FastAPI와 SQLite를 사용하여 구축되었습니다.

## 프로젝트 구조

```
app/
├── __init__.py
├── main.py                # FastAPI 애플리케이션 진입점
├── static/                # 정적 파일 (CSS, JS, 이미지 등)
│   ├── css/
│   │   ├── main.css       # 메인 스타일시트
│   │   └── about.css      # About 페이지 스타일
│   ├── js/
│   │   ├── main.js        # 메인 자바스크립트
│   │   └── language.js    # 다국어 지원 스크립트
│   └── assets/
│       └── images/
│           └── profile/
│               └── locomoco_main.jpg  # 프로필 이미지
└── templates/             # Jinja2 템플릿
    └── index.html         # 메인 페이지 (About) 템플릿
```

## 설치 및 실행 방법

### 필수 요구사항

- Python 3.8 이상
- FastAPI
- Uvicorn
- Jinja2

### 설치

1. 필요한 패키지 설치:

```bash
pip install fastapi uvicorn jinja2
```

2. 프로젝트 디렉토리 구조 생성:

```bash
mkdir -p app/static/{css,js,assets/images/profile}
mkdir -p app/templates
```

3. 제공된 파일들을 각 디렉토리에 복사:

   - `main.py` → app/ 디렉토리
   - `index.html` → app/templates/ 디렉토리
   - `main.css`, `about.css` → app/static/css/ 디렉토리
   - `main.js`, `language.js` → app/static/js/ 디렉토리

4. 프로필 이미지 준비:
   - `locomoco_main.jpg` 이미지 파일을 `app/static/assets/images/profile/` 디렉토리에 복사

### 실행

다음 명령어로 FastAPI 애플리케이션을 실행합니다:

```bash
# 프로젝트 루트 디렉토리에서 실행
uvicorn app.main:app --reload
```

서버가 실행되면 브라우저에서 http://localhost:8000 으로 접속하여 웹사이트를 확인할 수 있습니다.

## 추가 구현 예정 기능

1. **관리자 페이지**: WYSIWYG 에디터를 통한 콘텐츠 관리
2. **Work 페이지**: 포트폴리오 작업물 표시
3. **Contact 페이지**: 연락처 및 문의 양식
4. **다국어 지원 완성**: 한국어, 일본어, 영어 텍스트 번역 데이터 구현
5. **데이터베이스 연동**: SQLite를 사용한 콘텐츠 관리

## 참고 사항

현재 버전은 정적 HTML과 CSS만 구현되어 있으며, 동적 기능은 추후 업데이트될 예정입니다.

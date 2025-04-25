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
│   │   ├── about.css      # About 페이지 스타일
│   │   ├── work.css       # Work 페이지 스타일
│   │   ├── contact.css    # Contact 페이지 스타일
│   │   └── admin.css      # 관리자 페이지 스타일
│   ├── js/
│   │   ├── main.js        # 메인 자바스크립트
│   │   ├── language.js    # 다국어 지원 스크립트
│   │   ├── work.js        # Work 페이지 스크립트
│   │   ├── contact.js     # Contact 페이지 스크립트
│   │   └── admin.js       # 관리자 페이지 스크립트
│   └── assets/
│       └── images/
│           ├── profile/
│           │   └── locomoco_main.jpg  # 프로필 이미지
│           └── portfolio/
│               ├── thumb_sample1.jpg  # 포트폴리오 썸네일 샘플
│               └── thumb_sample2.jpg  # 포트폴리오 썸네일 샘플
└── templates/             # Jinja2 템플릿
    ├── index.html         # 메인 페이지 (About) 템플릿
    ├── work.html          # Work 페이지 템플릿
    ├── contact.html       # Contact 페이지 템플릿
    └── admin.html         # 관리자 페이지 템플릿
```

## 설치 및 실행 방법

### 필수 요구사항

- Python 3.8 이상
- FastAPI
- Uvicorn
- Jinja2
- Python-multipart (파일 업로드용)

### 설치

1. 필요한 패키지 설치:

```bash
pip install -r requirements.txt
```

2. 프로젝트 디렉토리 구조 생성:

```bash
mkdir -p app/static/{css,js,assets/images/{profile,portfolio}}
mkdir -p app/templates
```

3. 제공된 파일들을 각 디렉토리에 복사:

   - `main.py` → app/ 디렉토리
   - `index.html`, `admin.html` → app/templates/ 디렉토리
   - `main.css`, `about.css`, `admin.css` → app/static/css/ 디렉토리
   - `main.js`, `language.js`, `admin.js` → app/static/js/ 디렉토리

4. 필요한 이미지 파일 준비:
   - `locomoco_main.jpg` 이미지 파일을 `app/static/assets/images/profile/` 디렉토리에 복사
   - 썸네일 이미지 파일을 `app/static/assets/images/portfolio/` 디렉토리에 복사

### 실행

다음 명령어로 FastAPI 애플리케이션을 실행합니다:

```bash
# 프로젝트 루트 디렉토리에서 실행
uvicorn app.main:app --reload
```

서버가 실행되면 브라우저에서 http://localhost:8000 으로 접속하여 웹사이트를 확인할 수 있습니다.

## 관리자 페이지 접근

1. http://localhost:8000/admin 으로 접속
2. 기본 인증 창이 표시되면 다음 정보로 로그인:
   - 사용자 이름: locomoco
   - 비밀번호: admin123

> **주의**: 실제 배포 시에는 반드시 사용자 이름과 비밀번호를 변경하고, 환경 변수나 안전한 설정 파일을 통해 관리해야 합니다.

## 관리자 기능

현재 구현된 관리자 기능:

- **대시보드**: 기본 통계 정보 표시
- **About 페이지 관리**: 프로필 정보 및 이미지 수정
- **Work 목록 관리**: 포트폴리오 작업물 관리
- **다국어 컨텐츠 관리**: 한국어, 일본어, 영어 지원

## 기술 스택

- **백엔드**: FastAPI, Python 3.8+
- **프론트엔드**: HTML, CSS, JavaScript
- **템플릿 엔진**: Jinja2
- **데이터베이스**: SQLite (추후 구현 예정)
- **인증**: HTTP Basic Authentication (임시, 추후 개선 예정)

## 추가 구현 예정 기능

1. **데이터베이스 연동**: SQLite를 사용한 콘텐츠 관리
2. **파일 업로드 기능**: 이미지 및 비디오 파일 관리
3. **OAuth 인증**: 더 안전한 관리자 인증 시스템
4. **Work 페이지 구현**: 포트폴리오 작업물 표시
5. **Contact 페이지 구현**: 연락처 및 문의 양식
6. **다국어 지원 완성**: 한국어, 일본어, 영어 텍스트 번역 데이터 구현
7. **통계 기능**: 방문자 추적 및 인기 콘텐츠 분석

## 참고 사항

현재 버전은 기본적인 WYSIWYG 관리자 기능만 구현되어 있으며, 데이터베이스 연동 및 실제 데이터 저장 기능은 추후 업데이트될 예정입니다.

/**
 * language.js - 언어 전환 기능 구현
 * locomoco 포트폴리오 웹사이트
 */

// 언어 데이터를 외부 JSON 파일에서 로드하는 함수
async function loadTranslations(lang) {
  try {
    const response = await fetch(`locales/${lang}/translations.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`번역 파일 로드 오류(${lang}):`, error);
    return null;
  }
}

// 언어 데이터 객체 (초기 로드 데이터, 추후 외부 파일로 대체)
let translations = {
  ko: {},
  en: {},
  ja: {},
};

// 현재 언어 설정 (기본값: 한국어)
let currentLang = "ko";

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", async function () {
  // 초기 언어 데이터 로드
  await Promise.all([
    loadTranslations("ko").then((data) => {
      if (data) translations.ko = data;
    }),
    loadTranslations("en").then((data) => {
      if (data) translations.en = data;
    }),
    loadTranslations("ja").then((data) => {
      if (data) translations.ja = data;
    }),
  ]);

  // 언어 버튼 이벤트 리스너 설정
  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      changeLanguage(lang);

      // 활성화된 버튼 표시
      langButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // 저장된 언어 설정 확인
  const savedLang = localStorage.getItem("preferredLanguage");
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
  }

  // 페이지 로드 시 기본 언어로 설정
  changeLanguage(currentLang);

  // 해당 언어 버튼 활성화
  const langBtn = document.querySelector(
    `.lang-btn[data-lang="${currentLang}"]`
  );
  if (langBtn) {
    document
      .querySelectorAll(".lang-btn")
      .forEach((btn) => btn.classList.remove("active"));
    langBtn.classList.add("active");
  }
});

/**
 * 언어 변경 함수
 * @param {string} lang - 언어 코드 (ko, en, ja)
 */
function changeLanguage(lang) {
  if (!translations[lang]) {
    console.error("지원하지 않는 언어입니다:", lang);
    return;
  }

  currentLang = lang;

  // 언어 키를 가진 모든 요소 선택
  const elements = document.querySelectorAll("[data-lang-key]");

  // 각 요소의 텍스트 업데이트
  elements.forEach((el) => {
    const key = el.getAttribute("data-lang-key");
    if (translations[lang][key]) {
      // HTML 콘텐츠인 경우 innerHTML 사용
      if (key.includes(".content")) {
        el.innerHTML = translations[lang][key];
      } else {
        // 일반 텍스트인 경우 textContent 사용
        el.textContent = translations[lang][key];
      }
    }
  });

  // 언어에 따라 글꼴 우선순위 변경
  const html = document.documentElement;
  if (lang === "ko") {
    html.style.fontFamily =
      "'Noto Sans KR', 'Noto Sans JP', 'Poppins', sans-serif";
  } else if (lang === "ja") {
    html.style.fontFamily =
      "'Noto Sans JP', 'Noto Sans KR', 'Poppins', sans-serif";
  } else {
    html.style.fontFamily =
      "'Poppins', 'Noto Sans KR', 'Noto Sans JP', sans-serif";
  }

  // 로컬 스토리지에 언어 설정 저장
  localStorage.setItem("preferredLanguage", lang);
}

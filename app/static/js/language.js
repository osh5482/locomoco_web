/**
 * language.js - 다국어 지원 기능
 * locomoco 포트폴리오 웹사이트
 */

// 페이지 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", function () {
  // 언어 버튼 클릭 이벤트 리스너 설정
  setupLanguageButtons();

  // 사용자 브라우저 언어 설정 확인하여 기본 언어 설정
  setInitialLanguage();
});

/**
 * 언어 버튼에 클릭 이벤트 리스너를 설정합니다.
 */
function setupLanguageButtons() {
  const langButtons = document.querySelectorAll(".lang-btn");

  langButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      changeLanguage(lang);

      // 활성 버튼 스타일 변경
      langButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

/**
 * 사용자 브라우저 설정에 따라 초기 언어를 설정합니다.
 */
function setInitialLanguage() {
  // 브라우저의 언어 설정 가져오기
  const browserLang = navigator.language || navigator.userLanguage;

  // 기본 언어 설정 (ko, ja, en 중 하나)
  let defaultLang = "ko"; // 한국어를 기본값으로 설정

  // 브라우저 언어가 일본어인 경우
  if (browserLang.startsWith("ja")) {
    defaultLang = "ja";
  }
  // 브라우저 언어가 영어인 경우
  else if (browserLang.startsWith("en")) {
    defaultLang = "en";
  }

  // localStorage에 저장된 언어 설정이 있는지 확인
  const savedLang = localStorage.getItem("preferred_language");
  if (savedLang && ["ko", "ja", "en"].includes(savedLang)) {
    defaultLang = savedLang;
  }

  // 해당 언어 버튼 활성화
  const activeButton = document.querySelector(
    `.lang-btn[data-lang="${defaultLang}"]`
  );
  if (activeButton) {
    document
      .querySelectorAll(".lang-btn")
      .forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }
}

/**
 * 선택한 언어로 페이지 콘텐츠를 변경합니다.
 * 서버에 언어 변경 요청을 보내고 페이지를 새로고침합니다.
 */
function changeLanguage(lang) {
  console.log(`Changing language to: ${lang}`);

  // 언어 선택을 로컬 스토리지에 저장
  localStorage.setItem("preferred_language", lang);

  // 서버에 언어 변경 요청 보내기
  const formData = new FormData();
  formData.append("lang_code", lang);

  fetch("/api/set-language", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Language change response:", data);

      // 페이지 새로고침하여 새 언어로 콘텐츠 로드
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error changing language:", error);
    });
}

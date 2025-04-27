/**
 * navigation.js - 내비게이션 기능
 * locomoco 포트폴리오 웹사이트
 */

/**
 * 내비게이션 관리 객체
 */
const Navigation = {
  /**
   * 내비게이션 초기화
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.highlightCurrentPage();

      // 관리자 페이지인 경우 관리자 탭 기능 초기화
      if (window.location.pathname.includes("/admin")) {
        this.initAdminTabs();
      }
    });
  },

  /**
   * 현재 페이지 URL을 기반으로 네비게이션 메뉴의 활성 항목을 설정
   */
  highlightCurrentPage() {
    // 현재 URL 경로 가져오기
    const currentPath = window.location.pathname;

    // 모든 네비게이션 링크 가져오기
    const navLinks = document.querySelectorAll(".main-nav li");

    // 기본적으로 모든 활성 클래스 제거
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // 현재 경로에 맞는 링크 찾기 및 활성화
    navLinks.forEach((link) => {
      const anchor = link.querySelector("a");
      if (anchor) {
        const href = anchor.getAttribute("href");

        // 홈(index) 페이지 확인
        if (currentPath === "/" && href === "/") {
          link.classList.add("active");
        }
        // 다른 페이지들 확인 (예: /work, /contact 등)
        else if (currentPath.includes(href) && href !== "/") {
          link.classList.add("active");
        }
      }
    });
  },

  /**
   * 관리자 페이지 탭 초기화
   */
  initAdminTabs() {
    // URL 해시(#) 확인하여 해당 섹션 활성화
    const activateSectionFromHash = () => {
      // 현재 URL의 해시 가져오기 (기본값: #dashboard)
      let currentHash = window.location.hash;

      // 해시가 없거나 유효하지 않은 경우 대시보드로 설정
      if (!currentHash || !document.querySelector(currentHash)) {
        currentHash = "#dashboard";
        // URL 업데이트 (페이지 새로고침 없이)
        history.replaceState(null, null, currentHash);
      }

      // 네비게이션 링크 업데이트
      const navLinks = document.querySelectorAll(".admin-nav-link");
      navLinks.forEach((nav) => {
        nav.parentElement.classList.remove("active");
        if (nav.getAttribute("href") === currentHash) {
          nav.parentElement.classList.add("active");
        }
      });

      // 섹션 표시 업데이트
      const sections = document.querySelectorAll(".admin-section");
      sections.forEach((section) => {
        section.classList.remove("active");
      });

      // 해당 섹션 활성화
      const targetSection = document.querySelector(currentHash);
      if (targetSection) {
        targetSection.classList.add("active");
      }
    };

    // 페이지 로드 시 초기화 함수 실행
    activateSectionFromHash();

    // 해시 변경 이벤트 감지
    window.addEventListener("hashchange", activateSectionFromHash);

    // 관리자 섹션 전환 기능
    const navLinks = document.querySelectorAll(".admin-nav-link");

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        // 현재 활성화된 네비게이션 링크 클래스 제거
        navLinks.forEach((nav) => {
          nav.parentElement.classList.remove("active");
        });

        // 클릭한 링크 활성화
        this.parentElement.classList.add("active");

        // 타겟 섹션 ID 가져오기
        const targetId = this.getAttribute("href");

        // URL 해시 업데이트 (페이지 새로고침 없이)
        history.pushState(null, null, targetId);

        // 모든 섹션 숨기기
        const sections = document.querySelectorAll(".admin-section");
        sections.forEach((section) => {
          section.classList.remove("active");
        });

        // 타겟 섹션만 표시
        document.querySelector(targetId).classList.add("active");
      });
    });
  },
};

// 내비게이션 초기화
Navigation.init();

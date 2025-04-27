/**
 * admin_core.js - 관리자 페이지 핵심 기능
 * locomoco 포트폴리오 웹사이트
 */

/**
 * 관리자 핵심 기능 객체
 */
const AdminCore = {
  /**
   * 초기화
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("관리자 핵심 기능이 초기화되었습니다.");

      // URL 해시(#) 확인하여 해당 섹션 활성화
      this.activateSectionFromHash();

      // 해시 변경 이벤트 감지
      window.addEventListener("hashchange", () =>
        this.activateSectionFromHash()
      );

      // 관리자 메뉴 탭 전환 이벤트 초기화
      this.initAdminNavigation();

      // 언어 탭 전환 기능 초기화
      this.initLanguageTabs();

      // 취소 및 뒤로가기 버튼 초기화
      this.initCancelButtons();

      // 관리자 모드 종료 버튼 초기화
      this.initExitAdminButton();
    });
  },

  /**
   * URL 해시에 따라 섹션 활성화
   */
  activateSectionFromHash() {
    // 현재 URL의 해시 가져오기 (기본값: #dashboard)
    let currentHash = window.location.hash;

    // 해시가 없거나 유효하지 않은 경우 대시보드로 설정
    if (!currentHash || !document.querySelector(currentHash)) {
      currentHash = "#dashboard";
      // URL 업데이트 (페이지 새로고침 없이)
      history.replaceState(null, null, currentHash);
    }

    console.log("현재 해시:", currentHash);

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
  },

  /**
   * 관리자 메뉴 탭 전환 이벤트 초기화
   */
  initAdminNavigation() {
    const navLinks = document.querySelectorAll(".admin-nav-link");
    const sections = document.querySelectorAll(".admin-section");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // 현재 활성화된 네비게이션 링크 클래스 제거
        navLinks.forEach((nav) => {
          nav.parentElement.classList.remove("active");
        });

        // 클릭한 링크 활성화
        link.parentElement.classList.add("active");

        // 타겟 섹션 ID 가져오기
        const targetId = link.getAttribute("href");

        // URL 해시 업데이트 (페이지 새로고침 없이)
        history.pushState(null, null, targetId);

        // 모든 섹션 숨기기
        sections.forEach((section) => {
          section.classList.remove("active");
        });

        // 타겟 섹션만 표시
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.classList.add("active");
        }
      });
    });

    // 빠른 작업 버튼도 동일한 로직 적용
    const quickActionBtns = document.querySelectorAll(".quick-action-btn");

    quickActionBtns.forEach((btn) => {
      if (btn.getAttribute("href")) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();

          const targetId = btn.getAttribute("href");

          // 네비게이션 링크 업데이트
          navLinks.forEach((nav) => {
            nav.parentElement.classList.remove("active");
            if (nav.getAttribute("href") === targetId) {
              nav.parentElement.classList.add("active");
            }
          });

          // 섹션 표시 업데이트
          sections.forEach((section) => {
            section.classList.remove("active");
          });

          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            targetSection.classList.add("active");

            // 폼 초기화 (Work 추가 페이지인 경우)
            if (targetId === "#work-add" && window.AdminWork) {
              window.AdminWork.resetWorkForm();
            }
          }
        });
      }
    });
  },

  /**
   * 언어 탭 전환 기능 초기화
   */
  initLanguageTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        // 현재 부모 요소 찾기
        const parentTab = this.closest(".edit-tabs");

        // 부모 탭이 없으면 리턴
        if (!parentTab) return;

        // Work 관련 페이지인지 확인 (Work 편집 페이지에서는 언어 탭이 없음)
        const isWorkSection = parentTab.closest("#work-add") !== null;
        if (isWorkSection) return;

        const lang = this.getAttribute("data-lang");

        // 같은 그룹의 탭 버튼 비활성화
        parentTab.querySelectorAll(".tab-btn").forEach((tab) => {
          tab.classList.remove("active");
        });

        // 클릭한 탭 버튼 활성화
        this.classList.add("active");

        // 관련 콘텐츠 찾기
        const tabContents =
          parentTab.parentElement.querySelectorAll(".tab-content");

        // 모든 콘텐츠 숨기기
        tabContents.forEach((content) => {
          content.classList.add("hidden");
        });

        // 선택한 언어의 콘텐츠만 표시
        const targetContent = parentTab.parentElement.querySelector(
          `#about-edit-${lang}`
        );
        if (targetContent) {
          targetContent.classList.remove("hidden");
        }
      });
    });
  },

  /**
   * 취소 및 뒤로가기 버튼 초기화
   */
  initCancelButtons() {
    const cancelButtons = document.querySelectorAll(".cancel-btn, .back-btn");

    cancelButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");

        if (targetId) {
          // 네비게이션 링크 업데이트
          const navLinks = document.querySelectorAll(".admin-nav-link");
          navLinks.forEach((nav) => {
            nav.parentElement.classList.remove("active");
            if (nav.getAttribute("href") === targetId) {
              nav.parentElement.classList.add("active");
            }
          });

          // 섹션 표시 업데이트
          const sections = document.querySelectorAll(".admin-section");
          sections.forEach((section) => {
            section.classList.remove("active");
          });

          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            targetSection.classList.add("active");
          }

          // URL 해시 업데이트
          history.pushState(null, null, targetId);
        }
      });
    });
  },

  /**
   * 관리자 모드 종료 버튼 초기화
   */
  initExitAdminButton() {
    const exitAdminBtn = document.querySelector(".exit-admin-btn");

    if (exitAdminBtn) {
      exitAdminBtn.addEventListener("click", () => {
        // 메인 페이지로 리디렉션
        window.location.href = "/";
      });
    }
  },
};

// 관리자 핵심 기능 초기화
AdminCore.init();

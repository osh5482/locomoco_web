/**
 * dashboard.js - 관리자 대시보드 기능
 * locomoco 포트폴리오 웹사이트
 */

/**
 * 관리자 대시보드 관리 객체
 */
const AdminDashboard = {
  /**
   * 초기화
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("관리자 대시보드가 로드되었습니다.");

      // 방문자 차트 초기화
      this.initVisitChart();

      // 빠른 작업 버튼 초기화
      this.initQuickActions();

      // 관리자 모드 종료 버튼 초기화
      this.initExitAdminButton();

      // 취소 및 뒤로가기 버튼 초기화
      this.initCancelButtons();
    });
  },

  /**
   * 방문자 차트 초기화 함수
   */
  initVisitChart() {
    const visitBars = document.querySelectorAll(".visit-bar");
    let maxCount = 0;

    // 최대 방문자 수 찾기
    visitBars.forEach((bar) => {
      const count = parseInt(bar.dataset.count || 0);
      if (count > maxCount) maxCount = count;
    });

    // 각 바에 높이 적용
    visitBars.forEach((bar) => {
      const count = parseInt(bar.dataset.count || 0);
      // 최대값이 0인 경우 모든 바를 0%로 설정
      const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
      bar.style.height = heightPercent + "%";

      // 툴팁 추가 (방문자 수 표시)
      bar.setAttribute("title", `방문자: ${count}명`);
    });
  },

  /**
   * 빠른 작업 버튼 초기화
   */
  initQuickActions() {
    const quickActionBtns = document.querySelectorAll(".quick-action-btn");

    quickActionBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // href 속성이 있는 경우 (새 작품 등록 링크)
        if (btn.getAttribute("href")) {
          e.preventDefault();

          const targetId = btn.getAttribute("href");

          // 네비게이션 링크 업데이트
          const navLinks = document.querySelectorAll(".admin-nav-link");
          navLinks.forEach((nav) => {
            nav.parentElement.classList.remove("active");
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

          // 폼 초기화
          if (targetId === "#work-add" && window.AdminWork) {
            window.AdminWork.resetWorkForm();
          }
        }
        // ID에 따른 특정 기능 수행
        else if (btn.id) {
          switch (btn.id) {
            case "refresh-btn":
              // 페이지 새로고침
              window.location.reload();
              break;
            case "backup-btn":
              // 백업 다운로드 기능 (나중에 서버 연동)
              alert("백업 파일이 다운로드되었습니다.");
              break;
            case "help-btn":
              // 도움말 표시 기능
              alert(
                "관리자 페이지 도움말: 왼쪽 메뉴에서 관리할 섹션을 선택하세요."
              );
              break;
          }
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
        }
      });
    });
  },
};

// 관리자 대시보드 초기화
AdminDashboard.init();

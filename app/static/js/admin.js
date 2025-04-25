/**
 * admin.js - 관리자 페이지 기능
 * locomoco 포트폴리오 웹사이트
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("관리자 페이지가 로드되었습니다.");

  // URL 해시(#) 확인하여 해당 섹션 활성화
  function activateSectionFromHash() {
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
  }

  // 페이지 로드 시 초기화 함수 실행
  activateSectionFromHash();

  // 해시 변경 이벤트 감지
  window.addEventListener("hashchange", activateSectionFromHash);

  // 관리자 섹션 전환 기능
  const navLinks = document.querySelectorAll(".admin-nav-link");
  const sections = document.querySelectorAll(".admin-section");

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
      sections.forEach((section) => {
        section.classList.remove("active");
      });

      // 타겟 섹션만 표시
      document.querySelector(targetId).classList.add("active");
    });
  });

  // 언어 탭 전환 기능 - About 섹션에만 적용
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

  // 빠른 작업 버튼 기능
  const quickActionBtns = document.querySelectorAll(".quick-action-btn");

  quickActionBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // href 속성이 있는 경우 (새 작품 등록 링크)
      if (this.getAttribute("href")) {
        e.preventDefault();

        const targetId = this.getAttribute("href");

        // 네비게이션 링크 업데이트
        navLinks.forEach((nav) => {
          nav.parentElement.classList.remove("active");
        });

        // 섹션 표시 업데이트
        sections.forEach((section) => {
          section.classList.remove("active");
        });

        document.querySelector(targetId).classList.add("active");
      }
      // ID에 따른 특정 기능 수행
      else if (this.id) {
        switch (this.id) {
          case "refresh-btn":
            // 새로고침 기능 (나중에 AJAX로 구현)
            alert("캐시가 새로고침되었습니다.");
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

  // 취소 및 뒤로가기 버튼 기능
  const cancelButtons = document.querySelectorAll(".cancel-btn, .back-btn");

  cancelButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");

      if (targetId) {
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

        document.querySelector(targetId).classList.add("active");
      }
    });
  });

  // 관리자 모드 종료 버튼
  const exitAdminBtn = document.querySelector(".exit-admin-btn");

  if (exitAdminBtn) {
    exitAdminBtn.addEventListener("click", function () {
      // 메인 페이지로 리디렉션
      window.location.href = "/";
    });
  }

  // 파일 업로드 미리보기 기능
  const fileInputs = document.querySelectorAll(".file-input");

  fileInputs.forEach((input) => {
    input.addEventListener("change", function (e) {
      if (this.files && this.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          // 미리보기 이미지 요소 찾기 또는 생성
          const uploadBox = input.parentElement;
          let previewImage = uploadBox.querySelector(".preview-uploaded");

          // 기존 미리보기 이미지가 없으면 생성
          if (!previewImage) {
            previewImage = document.createElement("img");
            previewImage.className = "preview-uploaded";
            uploadBox.appendChild(previewImage);

            // 라벨 스타일 변경
            const label = uploadBox.querySelector(".upload-label");
            if (label) {
              label.style.opacity = "0.2";
            }
          }

          // 미리보기 이미지 소스 설정
          previewImage.src = e.target.result;
        };

        reader.readAsDataURL(this.files[0]);
      }
    });
  });

  // 작품 편집 버튼
  const editButtons = document.querySelectorAll(".edit-btn");

  editButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // 실제 구현 시에는 해당 작품 데이터를 불러와 편집 폼에 채워넣기

      // 편집 섹션으로 이동
      sections.forEach((section) => {
        section.classList.remove("active");
      });

      const workAddSection = document.querySelector("#work-add");
      if (workAddSection) {
        workAddSection.classList.add("active");
        // 폼 제목 변경
        const headerTitle = workAddSection.querySelector(".admin-header h1");
        if (headerTitle) {
          headerTitle.textContent = "작품 편집";
        }
      }
    });
  });

  // 작품 삭제 버튼
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // 실제 구현 시에는 확인 대화상자 표시 후 삭제 처리
      if (confirm("정말 이 작품을 삭제하시겠습니까?")) {
        // 삭제 확인 시 처리할 기능 (백엔드 연결 시 구현)
        alert("삭제되었습니다.");
      }
    });
  });

  // 폼 저장 버튼 (나중에 AJAX 제출로 구현)
  const saveButtons = document.querySelectorAll(".save-btn");

  saveButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      // 간단한 폼 유효성 검사
      let isValid = true;
      const section = this.closest(".admin-section");

      // 필수 입력 필드 검사 (실제 구현 시 확장)
      const requiredFields = section.querySelectorAll(
        "input[required], textarea[required]"
      );
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("invalid");
        } else {
          field.classList.remove("invalid");
        }
      });

      if (isValid) {
        // 폼 저장 성공 메시지 (실제로는 AJAX 요청으로 대체)
        alert("변경사항이 저장되었습니다.");
      } else {
        alert("필수 항목을 모두 입력해주세요.");
      }
    });
  });
});

/**
 * admin.js - 관리자 페이지 기능
 * locomoco 포트폴리오 웹사이트
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("관리자 페이지가 로드되었습니다.");

  // 방문자 차트 초기화
  initVisitChart();

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

  // 방문자 차트 초기화 함수
  function initVisitChart() {
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

        // 폼 초기화
        if (targetId === "#work-add") {
          resetWorkForm();
        }
      }
      // ID에 따른 특정 기능 수행
      else if (this.id) {
        switch (this.id) {
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

  // About 페이지 폼 제출 처리
  const aboutForms = document.querySelectorAll(".about-edit-form");
  aboutForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      // 프로필 이미지는 ko 폼에서만 처리
      const langCode = formData.get("lang_code");

      if (langCode === "ko") {
        // 프로필 이미지 업로드 처리
        const profileImage = document.getElementById("profile-image");

        if (profileImage.files && profileImage.files[0]) {
          // 별도 API로 이미지 먼저 업로드
          const imageFormData = new FormData();
          imageFormData.append("profile_image", profileImage.files[0]);

          fetch("/api/admin/profile-image", {
            method: "POST",
            body: imageFormData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Profile image update response:", data);

              if (data.status === "success") {
                // 이미지 업로드 성공 시 About 내용 업데이트
                updateAboutContent(formData);
              } else {
                alert("이미지 업로드 중 오류가 발생했습니다: " + data.message);
              }
            })
            .catch((error) => {
              console.error("Error uploading image:", error);
              alert("이미지 업로드 중 오류가 발생했습니다.");
            });
        } else {
          // 이미지 변경 없이 About 내용만 업데이트
          updateAboutContent(formData);
        }
      } else {
        // 한국어가 아닌 경우 About 내용만 업데이트
        updateAboutContent(formData);
      }
    });
  });

  // About 콘텐츠 업데이트 함수
  function updateAboutContent(formData) {
    fetch("/api/admin/about", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("About content update response:", data);

        if (data.status === "success") {
          alert(data.message);
        } else {
          alert("콘텐츠 업데이트 중 오류가 발생했습니다: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating about content:", error);
        alert("콘텐츠 업데이트 중 오류가 발생했습니다.");
      });
  }

  // Work 편집 버튼
  const editButtons = document.querySelectorAll(".edit-btn");

  editButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const workId = this.getAttribute("data-work-id");

      // 작품 정보 가져오기 API 호출 (실제로는 구현 필요)
      fetch(`/api/admin/work/${workId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            populateWorkForm(data.work);

            // 편집 모드로 UI 변경
            const workAddSection = document.querySelector("#work-add");
            const headerTitle =
              workAddSection.querySelector(".admin-header h1");
            const submitBtn = workAddSection.querySelector(".save-btn");

            headerTitle.textContent = "작품 편집";
            submitBtn.textContent = "작품 업데이트";

            // 편집 섹션으로 이동
            sections.forEach((section) => {
              section.classList.remove("active");
            });
            workAddSection.classList.add("active");
          } else {
            alert("작품 정보를 불러올 수 없습니다: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching work data:", error);
          alert("작품 정보를 불러오는 중 오류가 발생했습니다.");
        });
    });
  });

  // 작품 삭제 버튼
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const workId = this.getAttribute("data-work-id");

      // 삭제 확인
      if (confirm("정말 이 작품을 삭제하시겠습니까?")) {
        // 삭제 API 호출
        fetch(`/api/admin/work/${workId}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              alert(data.message);

              // 삭제된 작품 요소 제거
              const workItem = document.querySelector(
                `.work-admin-item[data-work-id="${workId}"]`
              );
              if (workItem) {
                workItem.remove();
              }
            } else {
              alert("작품 삭제 중 오류가 발생했습니다: " + data.message);
            }
          })
          .catch((error) => {
            console.error("Error deleting work:", error);
            alert("작품 삭제 중 오류가 발생했습니다.");
          });
      }
    });
  });

  // 작품 등록/수정 폼 제출 처리
  const workForm = document.getElementById("work-form");
  if (workForm) {
    workForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      // 체크박스 처리
      const isActive = document.getElementById("work-active").checked;
      formData.set("is_active", isActive);

      // 작품 등록/수정 API 호출
      fetch("/api/admin/work", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert(data.message);

            // Work 목록 페이지로 이동 및 페이지 새로고침
            window.location.href = "/admin#work-list";
            window.location.reload();
          } else {
            alert("작품 저장 중 오류가 발생했습니다: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error saving work:", error);
          alert("작품 저장 중 오류가 발생했습니다.");
        });
    });
  }

  // 작품 폼 초기화 함수
  function resetWorkForm() {
    const form = document.getElementById("work-form");
    if (form) {
      form.reset();

      // 숨겨진 ID 필드 초기화
      document.getElementById("work-id").value = "";

      // 미리보기 이미지 제거
      const previewImage = document.querySelector(
        "#thumbnail-upload-box .preview-uploaded"
      );
      if (previewImage) {
        previewImage.remove();
      }

      // 라벨 스타일 복원
      const label = document.querySelector(
        "#thumbnail-upload-box .upload-label"
      );
      if (label) {
        label.style.opacity = "1";
      }

      // 헤더와 버튼 텍스트 변경
      const headerTitle = document.querySelector("#work-add .admin-header h1");
      const submitBtn = document.querySelector("#work-add .save-btn");

      headerTitle.textContent = "새 작품 등록";
      submitBtn.textContent = "작품 등록하기";
    }
  }

  // 작품 폼에 데이터 채우기 함수
  function populateWorkForm(work) {
    document.getElementById("work-id").value = work.id;
    document.getElementById("work-title").value = work.title;
    document.getElementById("work-artist").value = work.artist || "";
    document.getElementById("work-style").value = work.category;
    document.getElementById("work-year").value = work.year;
    document.getElementById("work-youtube").value = work.youtube_url || "";
    document.getElementById("work-desc").value = work.description || "";
    document.getElementById("work-active").checked = work.is_active;

    // 썸네일 이미지 미리보기 설정
    if (work.thumbnail_path) {
      const uploadBox = document.getElementById("thumbnail-upload-box");
      let previewImage = uploadBox.querySelector(".preview-uploaded");

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

      previewImage.src = work.thumbnail_path;
    }
  }
});

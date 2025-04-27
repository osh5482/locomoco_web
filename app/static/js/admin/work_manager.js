/**
 * work_manager.js - 작품 관리 기능
 * locomoco 포트폴리오 웹사이트
 */

/**
 * 작품 관리 객체
 */
const AdminWork = {
  /**
   * 초기화
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("작품 관리 기능이 로드되었습니다.");

      // 작품 편집 버튼 초기화
      this.initEditButtons();

      // 작품 삭제 버튼 초기화
      this.initDeleteButtons();

      // 작품 등록/수정 폼 제출 처리 초기화
      this.initWorkForm();

      // 파일 업로드 미리보기 초기화
      this.initFilePreview();
    });
  },

  /**
   * 작품 편집 버튼 초기화
   */
  initEditButtons() {
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const workId = btn.getAttribute("data-work-id");

        // API 유틸리티가 로드되었는지 확인
        if (window.API && window.API.getWorkById) {
          window.API.getWorkById(workId)
            .then((data) => {
              if (data.status === "success") {
                this.populateWorkForm(data.work);

                // 편집 모드로 UI 변경
                this.setEditMode();
              } else {
                alert("작품 정보를 불러올 수 없습니다: " + data.message);
              }
            })
            .catch((error) => {
              console.error("Error fetching work data:", error);
              alert("작품 정보를 불러오는 중 오류가 발생했습니다.");
            });
        } else {
          // 기본 fetch API 사용
          fetch(`/api/admin/work/${workId}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                this.populateWorkForm(data.work);

                // 편집 모드로 UI 변경
                this.setEditMode();
              } else {
                alert("작품 정보를 불러올 수 없습니다: " + data.message);
              }
            })
            .catch((error) => {
              console.error("Error fetching work data:", error);
              alert("작품 정보를 불러오는 중 오류가 발생했습니다.");
            });
        }
      });
    });
  },

  /**
   * 작품 삭제 버튼 초기화
   */
  initDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const workId = btn.getAttribute("data-work-id");

        // 삭제 확인
        if (confirm("정말 이 작품을 삭제하시겠습니까?")) {
          // API 유틸리티가 로드되었는지 확인
          if (window.API && window.API.deleteWork) {
            window.API.deleteWork(workId)
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
          } else {
            // 기본 fetch API 사용
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
        }
      });
    });
  },

  /**
   * 작품 등록/수정 폼 제출 처리 초기화
   */
  initWorkForm() {
    const workForm = document.getElementById("work-form");

    if (workForm) {
      workForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(workForm);

        // 체크박스 처리
        const isActive = document.getElementById("work-active").checked;
        formData.set("is_active", isActive);

        // API 유틸리티가 로드되었는지 확인
        if (window.API && window.API.saveWork) {
          window.API.saveWork(formData)
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
        } else {
          // 기본 fetch API 사용
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
        }
      });
    }
  },

  /**
   * 작품 폼 초기화 함수
   */
  resetWorkForm() {
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

      if (headerTitle) headerTitle.textContent = "새 작품 등록";
      if (submitBtn) submitBtn.textContent = "작품 등록하기";
    }
  },

  /**
   * 작품 폼에 데이터 채우기 함수
   * @param {Object} work - 작품 데이터 객체
   */
  populateWorkForm(work) {
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
  },

  /**
   * 편집 모드로 UI 변경
   */
  setEditMode() {
    // 편집 모드로 UI 변경
    const workAddSection = document.querySelector("#work-add");
    const headerTitle = workAddSection.querySelector(".admin-header h1");
    const submitBtn = workAddSection.querySelector(".save-btn");

    headerTitle.textContent = "작품 편집";
    submitBtn.textContent = "작품 업데이트";

    // 편집 섹션으로 이동
    const sections = document.querySelectorAll(".admin-section");
    sections.forEach((section) => {
      section.classList.remove("active");
    });
    workAddSection.classList.add("active");
  },

  /**
   * 파일 업로드 미리보기 초기화
   */
  initFilePreview() {
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
  },
};

// 전역 객체로 내보내기
window.AdminWork = AdminWork;

// 작품 관리 초기화
AdminWork.init();

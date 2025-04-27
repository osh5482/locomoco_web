/**
 * file-upload.js - 파일 업로드 기능
 * locomoco 포트폴리오 웹사이트
 */

/**
 * 파일 업로드 관리 객체
 */
const FileUpload = {
  /**
   * 초기화
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("파일 업로드 기능이 로드되었습니다.");

      // 파일 업로드 이벤트 초기화
      this.initFileInputs();

      // 드래그 앤 드롭 영역 초기화
      this.initDragDrop();
    });
  },

  /**
   * 파일 업로드 이벤트 초기화
   */
  initFileInputs() {
    const fileInputs = document.querySelectorAll(".file-input");

    fileInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        if (input.files && input.files[0]) {
          // 파일 유효성 검사
          if (this.validateFile(input.files[0])) {
            // 미리보기 생성
            this.createPreview(input);
          } else {
            // 유효하지 않은 파일 처리
            input.value = "";
            alert(
              "지원되지 않는 파일 형식입니다. JPG, JPEG, PNG 파일만 업로드 가능합니다."
            );
          }
        }
      });
    });
  },

  /**
   * 파일 미리보기 생성
   * @param {HTMLInputElement} input - 파일 입력 요소
   */
  createPreview(input) {
    const file = input.files[0];
    const reader = new FileReader();
    const uploadBox = input.parentElement;

    reader.onload = function (e) {
      // 미리보기 이미지 요소 찾기 또는 생성
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

        // 제거 버튼 생성 (선택적)
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-upload-btn";
        removeBtn.innerHTML = "&times;";
        removeBtn.title = "이미지 제거";
        uploadBox.appendChild(removeBtn);

        // 제거 버튼 클릭 이벤트
        removeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          // 미리보기 이미지 제거
          previewImage.remove();
          removeBtn.remove();

          // 파일 입력 초기화
          input.value = "";

          // 라벨 스타일 복원
          if (label) {
            label.style.opacity = "1";
          }
        });
      }

      // 미리보기 이미지 소스 설정
      previewImage.src = e.target.result;

      // 파일 정보 표시 (선택적)
      const fileInfo = document.createElement("div");
      fileInfo.className = "file-info";
      fileInfo.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
      uploadBox.appendChild(fileInfo);
    }.bind(this);

    reader.readAsDataURL(file);
  },

  /**
   * 파일 유효성 검사
   * @param {File} file - 검사할 파일
   * @returns {boolean} - 유효한 파일이면 true
   */
  validateFile(file) {
    // 파일 유형 확인
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      return false;
    }

    // 파일 크기 제한 (예: 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert(
        `파일 크기가 너무 큽니다. 최대 ${this.formatFileSize(
          maxSize
        )}까지 업로드 가능합니다.`
      );
      return false;
    }

    return true;
  },

  /**
   * 파일 크기 포맷
   * @param {number} bytes - 바이트 단위 크기
   * @returns {string} - 포맷된 크기 문자열
   */
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  /**
   * 드래그 앤 드롭 영역 초기화 (선택적)
   */
  initDragDrop() {
    const uploadBoxes = document.querySelectorAll(".upload-box");

    uploadBoxes.forEach((box) => {
      const input = box.querySelector(".file-input");

      if (!input) return;

      // 드래그 이벤트 처리
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        box.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });

      // 드래그 상태 스타일
      box.addEventListener("dragenter", () => {
        box.classList.add("drag-over");
      });

      box.addEventListener("dragover", () => {
        box.classList.add("drag-over");
      });

      box.addEventListener("dragleave", () => {
        box.classList.remove("drag-over");
      });

      // 파일 드롭 처리
      box.addEventListener("drop", (e) => {
        box.classList.remove("drag-over");

        const droppedFile = e.dataTransfer.files[0];

        // 파일 입력 요소에 파일 설정
        if (droppedFile && this.validateFile(droppedFile)) {
          // 일부 브라우저에서는 직접 input.files 설정이 불가능하므로
          // DataTransfer 객체를 사용하여 파일 목록 설정
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(droppedFile);
          input.files = dataTransfer.files;

          // 미리보기 생성
          this.createPreview(input);

          // 변경 이벤트 발생 (필요한 경우)
          const changeEvent = new Event("change", { bubbles: true });
          input.dispatchEvent(changeEvent);
        }
      });
    });
  },
};

// 파일 업로드 초기화
FileUpload.init();

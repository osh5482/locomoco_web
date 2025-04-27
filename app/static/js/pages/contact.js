/**
 * contact.js - Contact 페이지 기능
 * locomoco 포트폴리오 웹사이트
 */

/**
 * Contact 페이지 관리 객체
 */
const ContactPage = {
  /**
   * 초기화
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("Contact 페이지가 로드되었습니다.");

      // 연락처 폼 초기화
      this.initContactForm();
    });
  },

  /**
   * 연락처 폼 초기화
   */
  initContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
      // 폼 제출 이벤트 리스너
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // 폼 유효성 검사
        if (this.validateForm(contactForm)) {
          // 폼 데이터 수집
          const formData = new FormData(contactForm);

          // 폼 데이터 객체로 변환
          const formDataObj = {};
          formData.forEach((value, key) => {
            formDataObj[key] = value;
          });

          // 실제 구현에서는 여기서 AJAX 요청으로 서버에 데이터 전송
          console.log("폼 데이터:", formDataObj);

          // 폼 제출 성공 메시지 표시
          this.showSuccessMessage(contactForm);

          // 폼 초기화
          contactForm.reset();
        }
      });

      // 입력 필드에 실시간 유효성 검사 이벤트 리스너
      this.initFieldValidation(contactForm);
    }
  },

  /**
   * 폼 유효성 검사
   * @param {HTMLFormElement} form - 검사할 폼
   * @returns {boolean} - 유효하면 true
   */
  validateForm(form) {
    let isValid = true;

    // 필수 필드 검사
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");

    // Forms 유틸리티가 로드되었는지 확인
    const Forms = window.Forms || {};
    const markInvalid = Forms.markInvalid || this.markInvalid;
    const markValid = Forms.markValid || this.markValid;
    const isValidEmail = Forms.isValidEmail || this.isValidEmail;

    // 이름 필드 검사
    if (!nameField.value.trim()) {
      markInvalid(nameField, "이름을 입력해주세요.");
      isValid = false;
    } else {
      markValid(nameField);
    }

    // 이메일 필드 검사
    if (!emailField.value.trim()) {
      markInvalid(emailField, "이메일을 입력해주세요.");
      isValid = false;
    } else if (!isValidEmail(emailField.value)) {
      markInvalid(emailField, "유효한 이메일 주소를 입력해주세요.");
      isValid = false;
    } else {
      markValid(emailField);
    }

    // 메시지 필드 검사
    if (!messageField.value.trim()) {
      markInvalid(messageField, "문의 내용을 입력해주세요.");
      isValid = false;
    } else {
      markValid(messageField);
    }

    return isValid;
  },

  /**
   * 실시간 필드 유효성 검사 이벤트 리스너 초기화
   * @param {HTMLFormElement} form - 초기화할 폼
   */
  initFieldValidation(form) {
    const inputFields = form.querySelectorAll("input, textarea");

    // Forms 유틸리티가 로드되었는지 확인
    const Forms = window.Forms || {};
    const markInvalid = Forms.markInvalid || this.markInvalid;
    const markValid = Forms.markValid || this.markValid;
    const isValidEmail = Forms.isValidEmail || this.isValidEmail;

    inputFields.forEach((field) => {
      field.addEventListener("blur", function () {
        if (field.required && !field.value.trim()) {
          markInvalid(
            field,
            field.name.charAt(0).toUpperCase() +
              field.name.slice(1) +
              "을(를) 입력해주세요."
          );
        } else if (
          field.type === "email" &&
          field.value.trim() &&
          !isValidEmail(field.value)
        ) {
          markInvalid(field, "유효한 이메일 주소를 입력해주세요.");
        } else {
          markValid(field);
        }
      });
    });
  },

  /**
   * 성공 메시지 표시
   * @param {HTMLFormElement} form - 폼 요소
   */
  showSuccessMessage(form) {
    // 기존 성공 메시지 요소 찾기
    let successMessage = document.querySelector(".success-message");

    // 없으면 생성
    if (!successMessage) {
      successMessage = document.createElement("div");
      successMessage.className = "success-message";
      const formContainer = document.querySelector(".contact-form-container");
      formContainer.appendChild(successMessage);
    }

    // 메시지 내용 설정 및 표시
    successMessage.innerHTML =
      "<p>메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 답변 드리겠습니다.</p>";
    successMessage.classList.add("visible");

    // 3초 후 메시지 숨기기
    setTimeout(function () {
      successMessage.classList.remove("visible");
    }, 5000);
  },

  /**
   * 이메일 형식 검사 (Forms 유틸리티 미로드 시)
   * @param {string} email - 검사할 이메일 주소
   * @returns {boolean} - 유효한 이메일이면 true
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 필드를 유효하지 않은 상태로 표시 (Forms 유틸리티 미로드 시)
   * @param {HTMLElement} field - 필드 요소
   * @param {string} message - 오류 메시지
   */
  markInvalid(field, message) {
    field.classList.add("invalid");

    // 에러 메시지 요소 찾기 또는 생성
    let errorMessage = field.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains("error-message")) {
      errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }

    errorMessage.textContent = message;
    errorMessage.classList.add("visible");
  },

  /**
   * 필드를 유효한 상태로 표시 (Forms 유틸리티 미로드 시)
   * @param {HTMLElement} field - 필드 요소
   */
  markValid(field) {
    field.classList.remove("invalid");

    // 에러 메시지 요소 숨기기
    const errorMessage = field.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("error-message")) {
      errorMessage.classList.remove("visible");
    }
  },
};

// Contact 페이지 초기화
ContactPage.init();

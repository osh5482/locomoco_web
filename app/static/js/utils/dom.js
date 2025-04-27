/**
 * dom.js - DOM 조작 유틸리티
 * locomoco 포트폴리오 웹사이트
 */

/**
 * 요소 선택자
 * @param {string} selector - CSS 선택자
 * @param {Element} [context=document] - 요소를 찾을 컨텍스트
 * @returns {Element|null} - 선택된 요소 또는 null
 */
function qs(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * 여러 요소 선택자
 * @param {string} selector - CSS 선택자
 * @param {Element} [context=document] - 요소를 찾을 컨텍스트
 * @returns {NodeList} - 선택된 요소들
 */
function qsa(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * 이벤트 리스너 추가
 * @param {Element|NodeList|Array} elements - 이벤트를 추가할 요소 또는 요소 목록
 * @param {string} eventType - 이벤트 타입
 * @param {Function} callback - 이벤트 콜백 함수
 */
function on(elements, eventType, callback) {
  if (elements instanceof NodeList || Array.isArray(elements)) {
    elements.forEach((element) =>
      element.addEventListener(eventType, callback)
    );
  } else if (elements) {
    elements.addEventListener(eventType, callback);
  }
}

/**
 * 요소 생성
 * @param {string} tag - HTML 태그명
 * @param {Object} [attributes={}] - 요소의 속성
 * @param {string} [content=''] - 요소의 내부 텍스트
 * @returns {Element} - 생성된 요소
 */
function createElement(tag, attributes = {}, content = "") {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "class" || key === "className") {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  if (content) {
    element.textContent = content;
  }

  return element;
}

/**
 * 자식 요소 추가
 * @param {Element} parent - 부모 요소
 * @param {Element|Element[]} children - 추가할 자식 요소 또는 요소 배열
 */
function append(parent, children) {
  if (Array.isArray(children)) {
    children.forEach((child) => parent.appendChild(child));
  } else {
    parent.appendChild(children);
  }
}

/**
 * 요소 스타일 설정
 * @param {Element} element - 스타일을 설정할 요소
 * @param {Object} styles - 적용할 스타일 객체
 */
function setStyles(element, styles) {
  Object.entries(styles).forEach(([property, value]) => {
    element.style[property] = value;
  });
}

/**
 * 클래스 토글
 * @param {Element} element - 클래스를 토글할 요소
 * @param {string} className - 토글할 클래스명
 * @param {boolean} [force] - 강제로 추가(true) 또는 제거(false)
 */
function toggleClass(element, className, force) {
  if (force !== undefined) {
    element.classList.toggle(className, force);
  } else {
    element.classList.toggle(className);
  }
}

/**
 * 요소 내용 설정
 * @param {Element} element - 내용을 설정할 요소
 * @param {string} content - 설정할 내용 (HTML 문자열 가능)
 * @param {boolean} [isHTML=false] - HTML로 설정할지 여부
 */
function setContent(element, content, isHTML = false) {
  if (isHTML) {
    element.innerHTML = content;
  } else {
    element.textContent = content;
  }
}

/**
 * 요소 표시 상태 전환
 * @param {Element} element - 상태를 전환할 요소
 * @param {boolean} isVisible - 표시 여부
 */
function setVisibility(element, isVisible) {
  element.style.display = isVisible ? "block" : "none";
}

// DOM 유틸리티 내보내기
window.DOM = {
  qs,
  qsa,
  on,
  createElement,
  append,
  setStyles,
  toggleClass,
  setContent,
  setVisibility,
};

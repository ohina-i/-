// JavaScript - テキストアニメーション
document.addEventListener('DOMContentLoaded', () => {
  // テキストを文字単位で分割
  function splitTextToChars(element) {
  const text = element.textContent;
  element.textContent = '';

  const words = text.split(' ');
  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';

    for (let i = 0; i < word.length; i++) {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.textContent = word[i];
      charSpan.style.setProperty('--char-index', i);
      wordSpan.appendChild(charSpan);
    }

    element.appendChild(wordSpan);

    if (wordIndex < words.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });
}

  // タイプライター効果
  function typeWriter(element) {
    const text = element.dataset.text || element.textContent;
    const speed = parseInt(element.dataset.speed) || 100;
    let index = 0;
    element.textContent = '';
   
    function type() {
      if (text.length > index) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          element.textContent = '';
          index = 0;
          type();
        }, 3000);
      }
    }
   
    type();
  }
 
  // 初期化
  document.querySelectorAll('.split-text').forEach(splitTextToChars);
  document.querySelectorAll('.typewriter').forEach(typeWriter);
});
 
// JavaScript - Intersection Observer API
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // 一度表示したら監視を解除（パフォーマンス向上）
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // すべてのスクロールアイテムを監視
  document.querySelectorAll('.scroll-item').forEach(item => {
    observer.observe(item);
  });
});
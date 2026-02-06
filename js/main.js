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
     
      for (let i = 0; i  wordIndex) {
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
 
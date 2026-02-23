/* =========================================================
   main.js  —  全機能まとめ
   ① テキストアニメーション
   ② Intersection Observer（スクロールアニメ）
   ③ レーダーチャート
   ④ ローディング画面
   ⑤ ダーク/ライトモード切替
   ⑥ カーソルエフェクト（PC限定）
   ⑦ viewMore 開閉
   ⑧ コンタクトフォーム開閉
   ⑨ Page Top スムーズスクロール
   ⑩ アクティブメニュー
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------
     ① テキストアニメーション
  -------------------------------------------------- */
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
        setTimeout(() => { element.textContent = ''; index = 0; type(); }, 3000);
      }
    }
    type();
  }

  document.querySelectorAll('.split-text').forEach(splitTextToChars);
  document.querySelectorAll('.typewriter').forEach(typeWriter);


  /* --------------------------------------------------
     ② Intersection Observer（スクロールアニメ）
  -------------------------------------------------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-item').forEach(function (item) {
    observer.observe(item);
  });


  /* --------------------------------------------------
     ③ レーダーチャート
  -------------------------------------------------- */
  const labels    = ["PS", "AI", "HTML", "CSS", "JS"];
  const values    = [50, 60, 75, 60, 55];
  const maxValue  = 100;

  const canvas  = document.getElementById("radarChart");
  if (canvas) {
    const ctx     = canvas.getContext("2d");
    const width   = canvas.width;
    const height  = canvas.height;
    const centerX = width  / 2;
    const centerY = height / 2;
    const radius  = 140;
    const angleStep = (Math.PI * 2) / labels.length;

    function polarToCartesian(cx, cy, r, angle) {
      return {
        x: cx + r * Math.cos(angle - Math.PI / 2),
        y: cy + r * Math.sin(angle - Math.PI / 2)
      };
    }

    function drawGrid(levels) {
      levels = levels || 5;
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      for (let level = 1; level <= levels; level++) {
        const r = (radius / levels) * level;
        ctx.beginPath();
        for (let i = 0; i < labels.length; i++) {
          const p = polarToCartesian(centerX, centerY, r, angleStep * i);
          if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    function drawAxesAndLabels() {
      ctx.strokeStyle = "#aaa";
      ctx.fillStyle   = "#1a1a1a";
      ctx.font = "20px serif";
      for (let i = 0; i < labels.length; i++) {
        const angle = angleStep * i;
        const p     = polarToCartesian(centerX, centerY, radius, angle);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        const lp = polarToCartesian(centerX, centerY, radius + 25, angle);
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labels[i], lp.x, lp.y);
      }
    }

    function drawData(currentValues) {
      ctx.beginPath();
      currentValues.forEach(function (v, i) {
        const p = polarToCartesian(centerX, centerY, radius * (v / maxValue), angleStep * i);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle   = "rgba(232, 120, 235, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "rgba(201, 80, 120, 0.9)";
      ctx.lineWidth   = 2;
      ctx.stroke();
      ctx.fillStyle   = "rgba(200, 72, 125, 1)";
      currentValues.forEach(function (v, i) {
        const p = polarToCartesian(centerX, centerY, radius * (v / maxValue), angleStep * i);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawRadarChart(currentValues) {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawAxesAndLabels();
      if (currentValues.some(function (v) { return v > 0; })) drawData(currentValues);
    }

    drawRadarChart(values);

    const chartContainer = document.querySelector('.chart-container');
    const chartObserver  = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          chartContainer.classList.add('active');
          animateChart();
          chartObserver.unobserve(chartContainer);
        }
      });
    }, { threshold: 0.3 });

    function animateChart() {
      const duration   = 1500;
      const startTime  = performance.now();
      const startValues = [0, 0, 0, 0, 0];
      function animate(currentTime) {
        const elapsed     = currentTime - startTime;
        const progress    = Math.min(elapsed / duration, 1);
        const ease        = 1 - Math.pow(1 - progress, 3);
        const currentVals = values.map(function (t, i) {
          return startValues[i] + (t - startValues[i]) * ease;
        });
        drawRadarChart(currentVals);
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }

    chartObserver.observe(chartContainer);
  }


  /* --------------------------------------------------
     ④ ローディング画面
  -------------------------------------------------- */
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    // DOMContentLoadedの時点でアニメーション開始、2.2秒後にフェードアウト
    setTimeout(function () {
      loadingScreen.classList.add('fade-out');
      setTimeout(function () {
        loadingScreen.style.display = 'none';
      }, 700);
    }, 2200);
  }


  /* --------------------------------------------------
     ⑤ ダーク/ライトモード切替
  -------------------------------------------------- */
  const themeBtn  = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const root      = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
    }
  }

  // ページ読み込み時に保存済みテーマを反映
  applyTheme(localStorage.getItem('theme') || 'light');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next   = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
      themeBtn.classList.add('pop');
      setTimeout(function () { themeBtn.classList.remove('pop'); }, 300);
    });
  }


  /* --------------------------------------------------
     ⑥ カーソルエフェクト（かわいいリニューアル版）
  -------------------------------------------------- */
  if (!('ontouchstart' in window)) {
    const cursorMain = document.getElementById('cursor-main');
    const ring       = document.getElementById('cursor-ring');

    if (cursorMain && ring) {
      let mx = 0, my = 0;
      let rx = 0, ry = 0;

      // ── メインカーソル（即時追従） ──
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        cursorMain.style.left = mx + 'px';
        cursorMain.style.top  = my + 'px';
      });

      // ── リング（遅れて追従） ──
      (function animateRing() {
        rx += (mx - rx) * 0.10;
        ry += (my - ry) * 0.10;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
      })();

      // ── 軌跡ドット（移動中にピンクグラデの小球を残す） ──
      const trailColors = ['#f9a8c9','#e8789e','#f9d0e2','#c95078','#fce8f0'];
      let lastTrailTime = 0;
      document.addEventListener('mousemove', function (e) {
        const now = Date.now();
        if (now - lastTrailTime < 35) return;
        lastTrailTime = now;

        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        const size  = Math.random() * 7 + 4;
        const color = trailColors[Math.floor(Math.random() * trailColors.length)];
        trail.style.left   = e.clientX + 'px';
        trail.style.top    = e.clientY + 'px';
        trail.style.width  = size + 'px';
        trail.style.height = size + 'px';
        trail.style.background = color;
        trail.style.boxShadow  = '0 0 6px ' + color;
        document.body.appendChild(trail);
        setTimeout(function () { trail.remove(); }, 500);
      });

      // ── ホバー時の状態 ──
      document.querySelectorAll('a, button, #viewMore').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          cursorMain.classList.add('hover-state');
          ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', function () {
          cursorMain.classList.remove('hover-state');
          ring.classList.remove('hover');
        });
      });

      // ── クリック時：ハート爆発エフェクト ──
      document.addEventListener('mousedown', function (e) {
        cursorMain.classList.add('click-state');
        ring.classList.add('click');

        // 8個のハートが四方に飛び散る
        const burstEmojis = ['♥','♡','♥','💕','♡','♥','♡','♥'];
        burstEmojis.forEach(function (emoji, i) {
          const burst = document.createElement('span');
          burst.classList.add('cursor-burst');
          burst.textContent = emoji;
          burst.style.left     = e.clientX + 'px';
          burst.style.top      = e.clientY + 'px';
          burst.style.fontSize = (Math.random() * 10 + 8) + 'px';
          burst.style.color    = trailColors[Math.floor(Math.random() * trailColors.length)];

          // 360度均等に飛ばす
          const angle = (i / burstEmojis.length) * Math.PI * 2;
          const dist  = Math.random() * 45 + 30;
          burst.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
          burst.style.setProperty('--by', Math.sin(angle) * dist + 'px');
          document.body.appendChild(burst);
          setTimeout(function () { burst.remove(); }, 700);
        });
      });

      document.addEventListener('mouseup', function () {
        cursorMain.classList.remove('click-state');
        ring.classList.remove('click');
      });

      // ── 移動中にふわっとハートを残す ──
      const heartEmojis = ['♥','♡'];
      let lastHeartTime = 0;
      document.addEventListener('mousemove', function (e) {
        const now = Date.now();
        if (now - lastHeartTime < 120) return;
        lastHeartTime = now;

        const heart = document.createElement('span');
        heart.classList.add('cursor-heart');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left      = e.clientX + 'px';
        heart.style.top       = e.clientY + 'px';
        heart.style.fontSize  = (Math.random() * 8 + 7) + 'px';
        heart.style.color     = trailColors[Math.floor(Math.random() * trailColors.length)];

        const dx = (Math.random() * 40 - 20);
        heart.style.setProperty('--dx',   dx + 'px');
        heart.style.setProperty('--dx2',  dx * 1.3 + 'px');
        heart.style.setProperty('--rot',  (Math.random() * 30 - 15) + 'deg');
        heart.style.setProperty('--rot2', (Math.random() * 60 - 30) + 'deg');
        document.body.appendChild(heart);
        setTimeout(function () { heart.remove(); }, 1000);
      });
    }
  }


  /* --------------------------------------------------
     ⑦ viewMore 開閉
  -------------------------------------------------- */
  const viewMoreBtn  = document.getElementById("viewMore");
  const moreItems    = document.getElementById("moreItems");

  if (viewMoreBtn && moreItems) {
    viewMoreBtn.addEventListener('click', function () {
      moreItems.classList.toggle("open");
      if (moreItems.classList.contains("open")) {
        viewMoreBtn.textContent = "close";
        document.querySelectorAll("#moreItems .scroll-item").forEach(function (item) {
          observer.observe(item);
        });
      } else {
        viewMoreBtn.textContent = "view more";
      }
    });
  }


  /* --------------------------------------------------
     ⑧ コンタクトフォーム開閉
  -------------------------------------------------- */
  const openBtn     = document.getElementById("openForm");
  const contactForm = document.getElementById("contactForm");

  if (openBtn && contactForm) {
    openBtn.addEventListener('click', function (e) {
      e.preventDefault();
      contactForm.classList.toggle("open");
    });
  }


  /* --------------------------------------------------
     ⑨ Page Top スムーズスクロール
  -------------------------------------------------- */
  const topBtn = document.querySelector('.top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* --------------------------------------------------
     ⑩ アクティブメニュー
  -------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".menu a");

  function updateActiveMenu() {
    let current = "";
    sections.forEach(function (section) {
      const top    = section.offsetTop - 200;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveMenu);
  updateActiveMenu();

}); // end DOMContentLoaded
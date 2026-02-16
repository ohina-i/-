// ============================
        // テキストアニメーション
        // ============================
        document.addEventListener('DOMContentLoaded', () => {
 
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
                        setTimeout(() => {
                            element.textContent = '';
                            index = 0;
                            type();
                        }, 3000);
                    }
                }
 
                type();
            }
 
            document.querySelectorAll('.split-text').forEach(splitTextToChars);
            document.querySelectorAll('.typewriter').forEach(typeWriter);
        });
 
 
        // ============================
        // Intersection Observer
        // ============================
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
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
 
            document.querySelectorAll('.scroll-item').forEach(item => {
                observer.observe(item);
            });
        });
 
 
        document.addEventListener('DOMContentLoaded', () => {
 
            // レーダーチャート用のデータ
            const labels = ["Photoshop", "Illustrator", "HTML", "CSS", "JavaScript"];
            const values = [50, 60, 75, 60, 55];
            const maxValue = 100;
            const photoshop_max = 50;
 
            const canvas = document.getElementById("radarChart");
            const ctx = canvas.getContext("2d");
 
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = 140;
 
            const angleStep = (Math.PI * 2) / labels.length;
 
            function polarToCartesian(centerX, centerY, r, angle) {
                return {
                    x: centerX + r * Math.cos(angle - Math.PI / 2),
                    y: centerY + r * Math.sin(angle - Math.PI / 2)
                };
            }
 
            function drawGrid(levels = 5) {
                ctx.strokeStyle = "#ddd";
                ctx.lineWidth = 1;
 
                for (let level = 1; level <= levels; level++) {
                    const r = (radius / levels) * level;
                    ctx.beginPath();
                    for (let i = 0; i < labels.length; i++) {
                        const angle = angleStep * i;
                        const { x, y } = polarToCartesian(centerX, centerY, r, angle);
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
 
            function drawAxesAndLabels() {
                ctx.strokeStyle = "#aaa";
                ctx.fillStyle = "#333";
                ctx.font = "12px system-ui";
 
                for (let i = 0; i < labels.length; i++) {
                    const angle = angleStep * i;
                    const { x, y } = polarToCartesian(centerX, centerY, radius, angle);
 
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
 
                    const labelPos = polarToCartesian(centerX, centerY, radius + 20, angle);
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(labels[i], labelPos.x, labelPos.y);
                }
            }
 
            function drawData(currentValues) {
                ctx.beginPath();
                for (let i = 0; i < currentValues.length; i++) {
                    const valueRatio = currentValues[i] / maxValue;
                    const r = radius * valueRatio;
                    const angle = angleStep * i;
                    const { x, y } = polarToCartesian(centerX, centerY, r, angle);
 
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
 
                ctx.fillStyle = "rgba(54, 162, 235, 0.3)";
                ctx.fill();
 
                ctx.strokeStyle = "rgba(54, 162, 235, 0.9)";
                ctx.lineWidth = 2;
                ctx.stroke();
 
                ctx.fillStyle = "rgba(54, 162, 235, 1)";
                for (let i = 0; i < currentValues.length; i++) {
                    const valueRatio = currentValues[i] / maxValue;
                    const r = radius * valueRatio;
                    const angle = angleStep * i;
                    const { x, y } = polarToCartesian(centerX, centerY, r, angle);
 
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
 
            function drawRadarChart(currentValues) {
                ctx.clearRect(0, 0, width, height);
                drawGrid();
                drawAxesAndLabels();
                if (currentValues.some(v => v > 0)) {
                    drawData(currentValues);
                }
            }
 
            drawRadarChart(values);
 
            const chartContainer = document.querySelector('.chart-container');
 
            const chartObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        chartContainer.classList.add('active');
                        animateChart();
                        chartObserver.unobserve(chartContainer);
                    }
                });
            }, { threshold: 0.3 });
 
            function animateChart() {
                const duration = 1500;
                const startTime = performance.now();
                const startValues = [0, 0, 0, 0, 0];
 
                function animate(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
 
                    const currentValues = values.map((target, i) =>
                        startValues[i] + (target - startValues[i]) * easeProgress
                    );
 
                    drawRadarChart(currentValues);
 
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }
 
                requestAnimationFrame(animate);
            }
 
            chartObserver.observe(chartContainer);
        });
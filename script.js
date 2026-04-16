// -------- Lightning & Splash Effect Canvas --------
(function initLightningEffect() {
    const canvas = document.getElementById('splash-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let mouse = { x: -100, y: -100 };
    let trails = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Add a "trail" point for lightning start
        if (Math.random() > 0.7) {
            trails.push({
                x: mouse.x,
                y: mouse.y,
                life: 1.0
            });
        }
    });
    
    function drawLightning(x, y, segments, length, angle) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = '#00ff88';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff88';
        ctx.lineWidth = 1.5;
        
        let curX = x;
        let curY = y;
        
        for (let i = 0; i < segments; i++) {
            const offset = (Math.random() - 0.5) * 40;
            const newX = curX + Math.cos(angle) * (length / segments) + offset;
            const newY = curY + Math.sin(angle) * (length / segments) + offset;
            
            ctx.lineTo(newX, newY);
            
            // Randomly branch
            if (Math.random() > 0.8 && i < segments - 1) {
                drawLightning(newX, newY, 3, length / 2, angle + (Math.random() - 0.5));
            }
            
            curX = newX;
            curY = newY;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    function animate() {
        // Subtle clear for trail effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        trails.forEach((t, index) => {
            t.life -= 0.05;
            if (t.life <= 0) {
                trails.splice(index, 1);
                return;
            }
            
            ctx.globalAlpha = t.life;
            const angle = Math.random() * Math.PI * 2;
            drawLightning(t.x, t.y, 5, 60, angle);
            ctx.globalAlpha = 1.0;
        });
        
        // Occasional random bolt around mouse
        if (Math.random() > 0.92) {
            const angle = Math.random() * Math.PI * 2;
            drawLightning(mouse.x, mouse.y, 6, 100, angle);
        }
        
        requestAnimationFrame(animate);
    }
    animate();
})();

// -------- Scroll Reveal Animation --------
(function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });
    
    reveals.forEach(el => observer.observe(el));
})();

// -------- Smooth Scrolling --------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Navbar height offset
                behavior: 'smooth'
            });
        }
    });
});

// -------- Navbar Scroll Effect --------
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.height = '70px';
        nav.style.background = 'rgba(5, 5, 5, 0.95)';
    } else {
        nav.style.height = '80px';
        nav.style.background = 'rgba(5, 5, 5, 0.8)';
    }
});

// -------- Form Submission Placeholder --------
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = '#00cc66';
        contactForm.reset();
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    });
}

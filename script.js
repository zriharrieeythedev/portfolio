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

// -------- Contact form: open a pre-addressed email draft --------
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!contactForm.reportValidity()) return;

        const name = contactForm.querySelector('[name="name"]').value.trim();
        const email = contactForm.querySelector('[name="email"]').value.trim();
        const message = contactForm.querySelector('[name="message"]').value.trim();
        const recipient = 'sreeharis7306@gmail.com';
        const subject = `Portfolio message from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        const status = contactForm.querySelector('.form-status');
        if (status) status.textContent = 'Your email app should open with the message ready. Review it and press Send there.';
        window.location.href = mailto;
    });
}


// -------- Infinite horizontal project gallery --------
(function initGalleryCarousel() {
    const viewport = document.getElementById('gallery-viewport');
    if (!viewport) return;
    const counter = document.getElementById('gallery-count');
    const sourceCards = [...viewport.querySelectorAll('.gallery-item')];
    const count = sourceCards.length;
    if (!count) return;

    // Copies on both sides make the carousel loop continuously in either direction.
    viewport.prepend(...sourceCards.map(card => card.cloneNode(true)));
    viewport.append(...sourceCards.map(card => card.cloneNode(true)));
    const cards = [...viewport.querySelectorAll('.gallery-item')];
    let active = count + 1;
    let settleTimer;

    function update(index) {
        active = Math.max(0, Math.min(cards.length - 1, index));
        cards.forEach((card, i) => card.classList.toggle('is-active', i === active));
        const current = (active % count) + 1;
        counter.textContent = `${String(current).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    }
    function center(card, smooth = true) {
        if (smooth) {
            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
            viewport.style.scrollBehavior = 'auto';
            viewport.style.scrollSnapType = 'none';
            viewport.scrollLeft = card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2;
            requestAnimationFrame(() => {
                viewport.style.scrollBehavior = '';
                viewport.style.scrollSnapType = '';
            });
        }
    }
    function closestIndex() {
        const centerX = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
        let best = 0, bestDistance = Infinity;
        cards.forEach((card, i) => {
            const distance = Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - centerX);
            if (distance < bestDistance) { best = i; bestDistance = distance; }
        });
        return best;
    }
    function go(index) {
        const next = Math.max(0, Math.min(cards.length - 1, index));
        update(next);
        center(cards[next]);
    }
    document.getElementById('gallery-prev').addEventListener('click', () => go(active - 1));
    document.getElementById('gallery-next').addEventListener('click', () => go(active + 1));
    viewport.addEventListener('scroll', () => {
        clearTimeout(settleTimer);
        update(closestIndex());
        settleTimer = setTimeout(() => {
            let next = closestIndex();
            if (next < count) next += count;
            else if (next >= count * 2) next -= count;
            if (next !== closestIndex()) center(cards[next], false);
            update(next);
        }, 130);
    }, { passive: true });

    let dragging = false, pointerX = 0, initialScroll = 0;
    viewport.addEventListener('pointerdown', event => {
        if (event.target.closest('a, button')) return;
        dragging = true; pointerX = event.clientX; initialScroll = viewport.scrollLeft;
        viewport.classList.add('is-dragging');
        viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', event => {
        if (dragging) viewport.scrollLeft = initialScroll - (event.clientX - pointerX);
    });
    const endDrag = () => { dragging = false; viewport.classList.remove('is-dragging'); };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    window.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') go(active - 1);
        if (event.key === 'ArrowRight') go(active + 1);
    });
    requestAnimationFrame(() => { update(active); center(cards[active], false); });
})();

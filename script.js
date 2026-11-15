document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu responsivo mobile
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 2. Accordion de Perguntas Frequentes (FAQ)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            faqItems.forEach(other => {
                other.classList.remove('open');
                const otherBtn = other.querySelector('.faq-question');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 3. Revelação suave das seções durante a rolagem
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );

        revealElements.forEach(el => observer.observe(el));

        // Fallback de segurança para garantir visibilidade
        setTimeout(() => {
            revealElements.forEach(el => el.classList.add('is-visible'));
        }, 1200);
    } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // 4. Interações dinâmicas com o cursor (apenas desktop com mouse e sem redução de movimento)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
        return;
    }

    // 4a. Aura ambiental com interpolação suave
    const spotlight = document.getElementById('cursorSpotlight');
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    // 4b. Elementos com paralaxe sutil pelo cursor
    const parallaxItems = document.querySelectorAll('[data-parallax]');

    window.addEventListener('mousemove', e => {
        targetX = e.clientX;
        targetY = e.clientY;

        if (spotlight && spotlight.style.opacity !== '1') {
            spotlight.style.opacity = '1';
        }

        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;

        parallaxItems.forEach(item => {
            const factor = parseFloat(item.getAttribute('data-parallax')) || 0;
            const moveX = normX * factor * 900;
            const moveY = normY * factor * 900;
            item.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
        });
    });

    document.addEventListener('mouseleave', () => {
        if (spotlight) spotlight.style.opacity = '0';
    });

    function animateSpotlight() {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        if (spotlight) {
            spotlight.style.transform = `translate3d(${currentX - 270}px, ${currentY - 270}px, 0)`;
        }
        requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();

    // 4c. Inclinação 3D e brilho interno nos cards e foto
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3.5;
            const rotateY = ((x - centerX) / centerX) * 3.5;

            card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // 4d. Atração magnética sutil nos botões e ícones sociais
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const offsetX = e.clientX - (rect.left + rect.width / 2);
            const offsetY = e.clientY - (rect.top + rect.height / 2);

            btn.style.transform = `translate3d(${(offsetX * 0.22).toFixed(2)}px, ${(offsetY * 0.22).toFixed(2)}px, 0)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
});

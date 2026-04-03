if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const heroImage = document.querySelector('.hero-image');
    const heroText = document.querySelector('.hero-text');

    if (heroImage && heroText) {
        const tl = gsap.timeline();
        tl.fromTo(
            '.hero-image',
            { opacity: 0, scale: 0.8, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.7)', autoAlpha: 1 }
        ).fromTo(
            '.hero-text',
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', autoAlpha: 1 },
            '-=0.5'
        );
    }

    gsap.utils.toArray('.scroll-anim').forEach((element) => {
        gsap.fromTo(
            element,
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                autoAlpha: 1,
            }
        );
    });

    if (document.querySelector('.skill-pill')) {
        gsap.fromTo(
            '.skill-pill',
            { opacity: 0, scale: 0.5 },
            {
                scrollTrigger: { trigger: '.skill-pill', start: 'top 90%' },
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.1,
                ease: 'back.out(1.5)',
                autoAlpha: 1,
            }
        );
    }

    if (document.querySelector('#produkte')) {
        gsap.fromTo(
            '.product-card',
            { opacity: 0, y: 50 },
            {
                scrollTrigger: { trigger: '#produkte', start: 'top 80%' },
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power3.out',
                autoAlpha: 1,
            }
        );
    }

    gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.fromTo(
            item,
            { opacity: 0, x: -30 },
            {
                scrollTrigger: { trigger: item, start: 'top 85%' },
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: 'power2.out',
                autoAlpha: 1,
            }
        );
    });

    if (document.querySelector('.testimonial-card')) {
        gsap.fromTo(
            '.testimonial-card',
            { opacity: 0, y: 40 },
            {
                scrollTrigger: { trigger: '.testimonial-card', start: 'top 85%' },
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power2.out',
                autoAlpha: 1,
            }
        );
    }

    if (document.querySelector('.faq-item')) {
        gsap.fromTo(
            '.faq-item',
            { opacity: 0, y: 20 },
            {
                scrollTrigger: { trigger: '.faq-item', start: 'top 90%' },
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.15,
                ease: 'power2.out',
                autoAlpha: 1,
            }
        );
    }
}

document.querySelectorAll('.faq-button').forEach((button) => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector('svg');
        if (!content) {
            return;
        }
        content.classList.toggle('hidden');
        if (icon) {
            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    });
});

document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const input = targetId ? document.getElementById(targetId) : null;
        if (!input) {
            return;
        }

        const shouldShow = input.type === 'password';
        input.type = shouldShow ? 'text' : 'password';
        button.classList.toggle('is-active', shouldShow);
        button.setAttribute('aria-label', shouldShow ? 'Passwort verbergen' : 'Passwort anzeigen');
    });
});
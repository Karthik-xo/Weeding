/**
 * MinMni Decors — Main JS v3.0 (Clean Rewrite)
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 650,
            once: true,
            offset: 60,
            easing: 'ease-out-quad',
            disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }

    // 2. Navbar — transparent on hero pages, white-glass on inner pages
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const isHeroPage = !!document.querySelector('.hero-section');

        const setNavState = () => {
            if (!isHeroPage) {
                navbar.classList.add('nav--solid');
                return;
            }
            navbar.classList.toggle('nav--scrolled', window.scrollY > 60);
        };

        window.addEventListener('scroll', setNavState, { passive: true });
        setNavState();
    }

    // 3. Mobile menu — Bootstrap handles toggler natively via data-bs-toggle.
    //    We only need to auto-close the menu when a nav-link is clicked on mobile.
    const navMenu = document.getElementById('navbarNav');
    if (navMenu && typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navMenu, { toggle: false });
        navMenu.querySelectorAll('.nav-link, .btn-luxury').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) bsCollapse.hide();
            });
        });
    }

    // 4. Hero slideshow
    const hero = document.querySelector('.hero-section');
    if (hero) {
        const imgs = [
            'assets/land1.jpg','assets/land2.jpg','assets/land3.jpg',
            'assets/land4.jpg','assets/land5.jpg','assets/land6.jpg','assets/land7.jpg'
        ];
        let idx = 0;
        const preload = src => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = src; });
        const cycle = async () => {
            const next = (idx + 1) % imgs.length;
            await preload(imgs[next]);
            idx = next;
            hero.style.backgroundImage = `url('${imgs[idx]}')`;
        };
        setInterval(cycle, 8000);
    }

    // 5. Sticky buttons — lift above footer
    const sticky = document.querySelector('.sticky-buttons');
    const foot = document.querySelector('footer');
    if (sticky && foot) {
        const lift = () => {
            const fr = foot.getBoundingClientRect();
            sticky.style.bottom = fr.top < window.innerHeight
                ? Math.max(30, window.innerHeight - fr.top + 16) + 'px'
                : '30px';
        };
        window.addEventListener('scroll', lift, { passive: true });
        lift();
    }

});

// Form validation (shared)
function validateForm(id) {
    const form = document.getElementById(id);
    if (!form) return false;
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => {
        el.classList.remove('is-invalid');
        if (!el.value.trim()) { el.classList.add('is-invalid'); ok = false; return; }
        if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
            el.classList.add('is-invalid'); ok = false;
        }
        if (el.type === 'tel' && el.value.replace(/\D/g,'').length < 10) {
            el.classList.add('is-invalid'); ok = false;
        }
    });
    const first = form.querySelector('.is-invalid');
    if (first) first.focus();
    return ok;
}

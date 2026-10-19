'use strict';

/**
 * PARTH ELEVATORS — MAIN JAVASCRIPT
 * Features:
 * 1. initNavbar() — Glassmorphism & scroll detection
 * 2. initMobileMenu() — Accessible hamburger overlay navigation
 * 3. initScrollReveal() — IntersectionObserver element reveals
 * 4. initParallax() — Smooth 60fps hero parallax via requestAnimationFrame
 * 5. initStatsCounter() — Eased numerical counter animations (easeOutQuart)
 * 6. initCustomCursor() — Precision lerp trailing luxury cursor (desktop only)
 * 7. initGallery() — Marquee pause on hover & touch interactions
 * 8. initSmoothScrollLinks() — Accurate navbar offset scrolling
 */

/**
 * 1. Navbar Scroll Effect
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on page load
}

/**
 * 2. Mobile Menu Navigation
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  const links = mobileNav.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 3. Scroll Reveal Animations (IntersectionObserver)
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/**
 * 4. Hero Background Parallax Effect
 */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  const heroSection = document.getElementById('home');
  if (!heroBg || !heroSection) return;

  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY <= heroHeight) {
      // Move background at 0.35x scroll speed for a subtle, elegant luxury feel
      const translateY = scrollY * 0.35;
      heroBg.style.transform = `scale(1.02) translateY(${translateY}px)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * 5. Animated Stats Counter (easeOutQuart)
 */
function initStatsCounter() {
  const statsBar = document.querySelector('.stats-bar');
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statsBar || !statNumbers.length) return;

  // Easing function: easeOutQuart
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const animateCounter = (element, target, duration = 2000) => {
    if (isNaN(target) || target <= 0) return;

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentVal = Math.floor(easedProgress * target);

      // Format with commas if > 999
      element.textContent = currentVal.toLocaleString();

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          if (!isNaN(target) && target > 0) {
            animateCounter(stat, target, 2000);
          }
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(statsBar);
}

/**
 * 6. Luxury Custom Cursor (Fine pointer desktop only)
 */
function initCustomCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  if (!cursorDot || !cursorRing) return;

  document.body.classList.add('custom-cursor-active');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      isVisible = true;
    }

    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
    isVisible = true;
  });

  // Lerp trailing animation loop for outer ring
  const lerp = (start, end, factor) => start + (end - start) * factor;

  const animateRing = () => {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);

    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    window.requestAnimationFrame(animateRing);
  };

  window.requestAnimationFrame(animateRing);

  // Hover expansion on interactive elements
  const hoverElements = document.querySelectorAll(
    'a, button, input, select, textarea, .project-card, .service-card, .fab, .about-image-row img'
  );

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
  });
}

/**
 * 7. Gallery Marquee Hover Controls
 */
function initGallery() {
  const track = document.querySelector('.gallery-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });

  // Touch device fallback support: allow manual horizontal scroll
  track.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  track.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
}

/**
 * 8. Smooth Scrolling with Navbar Height Offset
 */
function initSmoothScrollLinks() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  const navbar = document.getElementById('navbar');

  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

/**
 * DOM Ready Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initParallax();
  initStatsCounter();
  initCustomCursor();
  initGallery();
  initSmoothScrollLinks();
});

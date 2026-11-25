/**
 * Interacciones del portafolio: navegación accesible y animaciones GSAP.
 */
'use strict';

function initMobileNav() {
  const button = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  const cta = document.getElementById('navCta');
  if (!button || !links) return;

  const setMenuOpen = open => {
    button.classList.toggle('active', open);
    links.classList.toggle('open', open);
    if (cta) cta.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute(
      'aria-label',
      open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );
  };

  button.addEventListener('click', () => {
    setMenuOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  if (cta) cta.addEventListener('click', () => setMenuOpen(false));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      button.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setMenuOpen(false);
  });
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  if (typeof IntersectionObserver === 'undefined') return;

  const navAnchors = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}

function initGsapAnimations() {
  const { gsap, ScrollTrigger } = window;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    gsap.to(scrollProgress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'max',
        scrub: 0.25
      }
    });
  }

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .fromTo('.hero-label', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.65 })
    .fromTo('.hero-name .line', { autoAlpha: 0, y: 34 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.78,
      stagger: 0.1
    }, '-=0.34')
    .fromTo('.hero-tagline', { autoAlpha: 0, y: 18 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.62
    }, '-=0.36')
    .fromTo('.hero-actions, .hero-meta', { autoAlpha: 0, y: 14 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.52,
      stagger: 0.09
    }, '-=0.28');

  gsap.fromTo('.hero-photo-card', {
    autoAlpha: 0,
    y: 34,
    rotate: 5,
    scale: 0.97
  }, {
    autoAlpha: 1,
    y: 0,
    rotate: 1.2,
    scale: 1,
    duration: 1.05,
    delay: 0.18,
    ease: 'power3.out'
  });

  gsap.fromTo('.photo-orbit', { autoAlpha: 0, x: 18 }, {
    autoAlpha: 1,
    x: 0,
    duration: 0.65,
    delay: 0.65,
    ease: 'power2.out'
  });

  gsap.to('.hero-photo-card', {
    y: -7,
    duration: 2.8,
    delay: 1.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.photo-orbit', {
    y: -8,
    duration: 2.2,
    delay: 1.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  const knowledgePhoto = document.querySelector('.knowledge-photo');
  if (knowledgePhoto) {
    gsap.fromTo(knowledgePhoto, { scale: 1.12 }, {
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: knowledgePhoto,
        start: 'top 84%',
        once: true
      }
    });
  }

  gsap.utils.toArray('.reveal:not(.hero-content)').forEach(element => {
    gsap.fromTo(element, { autoAlpha: 0, y: 28 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.72,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
        once: true
      }
    });
  });

  gsap.utils.toArray('.project-card, .skill-card, .recognition-item').forEach(card => {
    const scaleCard = gsap.quickTo(card, 'scale', { duration: 0.2, ease: 'power2.out' });
    card.addEventListener('pointerenter', () => scaleCard(1.012));
    card.addEventListener('pointerleave', () => scaleCard(1));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initNavbar();
  initGsapAnimations();
});

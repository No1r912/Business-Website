/* Zyphera Digital — Main JavaScript */

(function () {
  'use strict';

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Reading progress ──
  const scrollProgress = document.getElementById('scrollProgress');
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (scrollable ? (window.scrollY / scrollable) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ── Mobile menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) toggleMenu();
    });
  });

  // ── Active nav link on scroll ──
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ── Fade-in on scroll ──
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  // ── Floating particles ──
  const particlesContainer = document.getElementById('particles');
  const particleCount = 18;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = 12 + Math.random() * 18 + 's';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.width = 2 + Math.random() * 3 + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
  }

  // ── Tech pills scroll parallax ──
  const techCloud = document.getElementById('techCloud');
  const techPills = techCloud.querySelectorAll('.tech-pill');

  techPills.forEach(function (pill, index) {
    const offset = (index % 3 - 1) * 4;
    pill.style.transform = 'translateY(' + offset + 'px)';
  });

  window.addEventListener(
    'scroll',
    function () {
      const rect = techCloud.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      if (rect.top < viewHeight && rect.bottom > 0) {
        const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
        techPills.forEach(function (pill, index) {
          const base = (index % 3 - 1) * 4;
          const shift = Math.sin(progress * Math.PI + index * 0.5) * 6;
          pill.style.transform = 'translateY(' + (base + shift) + 'px)';
        });
      }
    },
    { passive: true }
  );

  // ── Contact form ──
  const contactForm = document.getElementById('contact-form');

  if (contactForm) contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = contactForm.querySelector('.btn-submit');
    const originalText = btn.textContent;

    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'linear-gradient(135deg, #0891B2, #06B6D4)';
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = originalText;
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });

  // ── A quiet live signal makes the hero console feel operational ──
  const responseMetric = document.getElementById('responseMetric');
  if (responseMetric && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(function () {
      responseMetric.textContent = (22 + Math.floor(Math.random() * 15)) + ' ms';
    }, 2600);
  }

  // ── Gentle depth for cards on pointer devices ──
  if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.service-card, .project-panel, .contact-card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        card.style.transform = 'perspective(700px) rotateX(' + (-y * 3) + 'deg) rotateY(' + (x * 3) + 'deg) translateY(-5px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

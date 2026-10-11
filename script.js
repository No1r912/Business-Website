/* Zyphera Digital — Main JavaScript */

(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    const updateProgress = function () {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      scrollProgress.style.width = value + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  if (hamburger && mobileMenu) {
    const toggleMenu = function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (mobileMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  }

  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveLink = function () {
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
  };

  if (navLinks.length) {
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(function (element) {
      fadeObserver.observe(element);
    });
  }

  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
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
  }

  const techCloud = document.getElementById('techCloud');
  if (techCloud) {
    const techPills = techCloud.querySelectorAll('.tech-pill');

    techPills.forEach(function (pill, index) {
      const offset = (index % 3 - 1) * 4;
      pill.style.transform = 'translateY(' + offset + 'px)';
    });

    window.addEventListener('scroll', function () {
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
    }, { passive: true });
  }

  const serviceLinks = document.querySelectorAll('.service-link[data-service]');
  const serviceSelect = document.getElementById('service');
  if (serviceLinks.length && serviceSelect) {
    serviceLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const service = link.getAttribute('data-service');
        serviceSelect.value = service;
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  const projectDetails = {
    mahto: {
      category: 'Corporate Website Design',
      title: 'Mahto Group Website Redesign',
      description: 'A clean, premium corporate redesign concept focused on professional presentation, responsive layout, and a refined visual identity.',
      items: ['Responsive corporate layout', 'Clear information hierarchy', 'Modern service positioning'],
      stack: 'HTML / CSS / JS'
    },
    'zyphera-site': {
      category: 'Web Development',
      title: 'Zyphera Digital Website',
      description: 'The official Zyphera Digital website designed to present services, reassure prospective clients, and provide a simple enquiry path.',
      items: ['Service communication', 'Corporate homepage structure', 'Enquiry-focused conversion flow'],
      stack: 'HTML / CSS / JS'
    },
    'python-utils': {
      category: 'Python Scripting',
      title: 'Python Utility Projects',
      description: 'A collection of small Python utilities focused on file processing, task automation, and practical day-to-day support flows.',
      items: ['CSV and text handling', 'File organisation scripts', 'Basic automation utilities'],
      stack: 'Python'
    },
    'support-lab': {
      category: 'IT Troubleshooting',
      title: 'IT Support Simulation Lab',
      description: 'A practice environment for troubleshooting common system, software, and operating system issues in a controlled setting.',
      items: ['Windows troubleshooting practice', 'Basic software setup', 'Linux and support workflows'],
      stack: 'Windows / Linux'
    }
  };

  const modal = document.getElementById('projectModal');
  const modalVisual = document.getElementById('projectModalVisual');
  const modalCategory = document.getElementById('projectModalCategory');
  const modalTitle = document.getElementById('projectModalTitle');
  const modalDescription = document.getElementById('projectModalDescription');
  const modalList = document.getElementById('projectModalList');
  const modalStack = document.getElementById('projectModalStack');
  const modalClose = document.querySelector('.project-modal-close');

  const openProjectModal = function (key) {
    if (!modal || !projectDetails[key]) return;

    const details = projectDetails[key];
    modalCategory.textContent = details.category;
    modalTitle.textContent = details.title;
    modalDescription.textContent = details.description;
    modalList.innerHTML = details.items.map(function (item) {
      return '<li>' + item + '</li>';
    }).join('');
    modalStack.textContent = details.stack;

    modalVisual.style.background = key === 'mahto'
      ? 'linear-gradient(135deg, rgba(66,199,217,0.18), rgba(17,24,39,0.5)), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 28px)'
      : key === 'zyphera-site'
        ? 'linear-gradient(135deg, rgba(66,199,217,0.18), rgba(17,24,39,0.5)), linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 18%, transparent 18%, transparent 100%)'
        : key === 'python-utils'
          ? 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(17,24,39,0.5)), linear-gradient(90deg, rgba(66,199,217,0.18) 0, rgba(66,199,217,0.18) 40%, transparent 40%, transparent 100%)'
          : 'linear-gradient(135deg, rgba(66,199,217,0.16), rgba(17,24,39,0.5)), linear-gradient(180deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 24px)';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = function () {
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.project-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openProjectModal(card.getAttribute('data-project'));
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
  }

  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target.matches('[data-close="true"]') || event.target === modal) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    const fields = {
      name: contactForm.querySelector('#name'),
      email: contactForm.querySelector('#email'),
      service: contactForm.querySelector('#service'),
      message: contactForm.querySelector('#message')
    };

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setFormStatus = function (message, type) {
      formStatus.textContent = message;
      formStatus.className = 'form-status';
      if (type) {
        formStatus.classList.add(type);
      }
    };

    const setSubmittingState = function (isSubmitting) {
      if (!submitButton) return;

      submitButton.disabled = isSubmitting;
      submitButton.textContent = isSubmitting ? 'Submitting…' : 'Submit Enquiry';
    };

    Object.values(fields).forEach(function (field) {
      if (!field) return;

      field.addEventListener('input', function () {
        field.setAttribute('aria-invalid', 'false');
        if (formStatus.textContent) {
          setFormStatus('', '');
        }
      });
    });

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (submitButton && submitButton.disabled) {
        return;
      }

      const nameValue = (fields.name && fields.name.value || '').trim();
      const emailValue = (fields.email && fields.email.value || '').trim();
      const serviceValue = (fields.service && fields.service.value || '').trim();
      const messageValue = (fields.message && fields.message.value || '').trim();

      if (!nameValue || !emailValue || !serviceValue || !messageValue) {
        setFormStatus('Please complete all required fields before submitting.', 'error');

        if (!nameValue && fields.name) fields.name.focus();
        else if (!emailValue && fields.email) fields.email.focus();
        else if (!serviceValue && fields.service) fields.service.focus();
        else if (fields.message) fields.message.focus();

        return;
      }

      if (!emailPattern.test(emailValue)) {
        setFormStatus('Please enter a valid email address.', 'error');
        if (fields.email) {
          fields.email.focus();
          fields.email.setAttribute('aria-invalid', 'true');
        }
        return;
      }

      const payload = {
        name: nameValue,
        email: emailValue,
        service: serviceValue,
        businessName: (contactForm.querySelector('#businessName') || {}).value || '',
        budget: (contactForm.querySelector('#budget') || {}).value || '',
        message: messageValue
      };

      setFormStatus('Submitting your enquiry…', 'submitting');
      setSubmittingState(true);

      fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.text().then(function (text) {
            let data = {};
            if (text) {
              try {
                data = JSON.parse(text);
              } catch (error) {
                data = { message: text };
              }
            }
            return { status: response.status, data: data };
          });
        })
        .then(function (result) {
          if (result.status >= 200 && result.status < 300 && result.data && result.data.success) {
            setFormStatus('Your enquiry has been submitted successfully.', 'success');
            contactForm.reset();
            return;
          }

          const message = (result.data && result.data.message) || 'We could not submit your enquiry. Please try again.';
          setFormStatus(message, 'error');
        })
        .catch(function () {
          setFormStatus('The form could not be submitted right now. Please try again in a moment.', 'error');
        })
        .finally(function () {
          setSubmittingState(false);
        });
    });
  }

  const currentYear = document.getElementById('currentYear');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const responseMetric = document.getElementById('responseMetric');
  if (responseMetric && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(function () {
      responseMetric.textContent = (22 + Math.floor(Math.random() * 15)) + ' ms';
    }, 2600);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

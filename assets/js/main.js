/* ============================================================
   Kevin Prigge Portfolio — JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ---------- Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Nav: sticky shadow + mobile toggle ----------
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      // Animate hamburger → X
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
      spans[1].style.opacity  = isOpen ? '0' : '';
      spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      });
    });
  }

  // ---------- Active nav link on scroll ----------
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // ---------- Scroll reveal ----------
  const reveals = document.querySelectorAll(
    '.timeline-item, .project-card, .infra-card, .stat-card, .edu-card, ' +
    '.about-text, .about-stats, .skill-group, .contact-item, .contact-form'
  );

  reveals.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));

  // ---------- Skill bar animation ----------
  const skillSection = document.getElementById('skills');
  const skillFills = document.querySelectorAll('.skill-fill');

  if (skillSection && skillFills.length) {
    const skillObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        skillFills.forEach(fill => fill.classList.add('animated'));
        skillObserver.disconnect();
      }
    }, { threshold: 0.2 });
    skillObserver.observe(skillSection);
  }

  // ---------- Contact form ----------
  const form     = document.getElementById('contactForm');
  const status   = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic client-side validation
      const fields = ['name', 'email', 'subject', 'message'];
      let valid = true;
      fields.forEach(f => {
        const el = form.elements[f];
        if (!el.value.trim()) {
          el.style.borderColor = '#b84a3e';
          valid = false;
        } else {
          el.style.borderColor = '';
        }
      });
      if (!valid) {
        setStatus('Please fill in all required fields.', 'error');
        return;
      }

      // Email format check
      const emailVal = form.elements['email'].value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        form.elements['email'].style.borderColor = '#b84a3e';
        setStatus('Please enter a valid email address.', 'error');
        return;
      }

      // TODO: wire up to Formspree / Netlify Forms / your backend
      // Example Formspree: replace the action URL below
      // const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: { 'Accept': 'application/json' },
      //   body: new FormData(form),
      // });

      // Simulate success for now
      setStatus('Message sent! I\'ll get back to you soon.', 'success');
      form.reset();
    });
  }

  function setStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status ' + type;
    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
  }

})();

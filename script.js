/* ═══════════════════════════════════════════════════════════
   CYBER PORTFOLIO — script.js
   All interactive functionality for the cybersecurity portfolio
   Author: Ranjan Aryal | BCSIT Student
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. DOM READY — wait for full document parse
   ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initClock();
  initNavbar();
  initHeroCanvas();
  initTypingAnimation();
  initThemeToggle();
  initScrollReveal();
  initStickyNavbar();
  initSmoothScroll();
  initSkillBars();
  initSkillsTabs();
  initProjectFilters();
  initAnimatedCounters();
  initContactForm();
  initBackToTop();
  initTerminalWidget();
  initFooterYear();
  initHeroCounters();
});

/* ─────────────────────────────────────────────────────────
   2. LOADING SCREEN
   — Fake progress bar that fills to 100% then hides
   ───────────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPct = document.getElementById('loader-percent');

  if (!loader) return;

  let progress = 0;
  // Random speed increments to look realistic
  const increment = () => {
    if (progress < 100) {
      const delta = Math.random() * 12 + 3; // 3–15 per tick
      progress = Math.min(progress + delta, 100);
      loaderBar.style.width = progress + '%';
      loaderPct.textContent = Math.floor(progress) + '%';

      // Slow down near end for drama
      const delay = progress > 85 ? 180 : 60;
      setTimeout(increment, delay);
    } else {
      // Done — fade out loader after a short pause
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 600);
    }
  };

  document.body.style.overflow = 'hidden';
  setTimeout(increment, 300);
}

/* ─────────────────────────────────────────────────────────
   3. LIVE CLOCK
   — Updates navbar clock and about-section clock every second
   ───────────────────────────────────────────────────────── */
function initClock() {
  const navClock = document.getElementById('nav-clock');
  const aboutClock = document.getElementById('about-clock');

  const pad = n => String(n).padStart(2, '0');

  const tick = () => {
    const now = new Date();
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    if (navClock) navClock.textContent = time;
    if (aboutClock) aboutClock.textContent = `${date} · ${time}`;
  };

  tick();
  setInterval(tick, 1000);
}

/* ─────────────────────────────────────────────────────────
   4. NAVBAR — hamburger menu + active link highlight
   ───────────────────────────────────────────────────────── */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (!hamburger || !navLinks) return;

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Intersection observer for active section highlighting
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ─────────────────────────────────────────────────────────
   5. STICKY NAVBAR — adds .scrolled class with glassmorphism
   ───────────────────────────────────────────────────────── */
function initStickyNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const update = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─────────────────────────────────────────────────────────
   6. SMOOTH SCROLL — for all internal anchor links
   ───────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH = document.getElementById('navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─────────────────────────────────────────────────────────
   7. HERO CANVAS — Particle / Matrix animation
   ───────────────────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  // Resize handler
  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particle constructor
  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : -10;
      this.vy = Math.random() * 0.8 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '#00d4ff' : '#0a84ff';
      // Some particles are matrix chars
      this.isChar = Math.random() > 0.75;
      this.char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
    }
    update() {
      this.y += this.vy;
      this.x += this.vx;
      if (this.y > H + 10) this.reset();
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      if (this.isChar) {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size * 7}px 'Share Tech Mono', monospace`;
        ctx.fillText(this.char, this.x, this.y);
        // Occasionally change char
        if (Math.random() < 0.01) this.char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
  }

  // Spawn initial particles
  const COUNT = Math.min(160, Math.floor(W / 8));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Connection lines between close particles
  const drawConnections = () => {
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.globalAlpha = (1 - dist / maxDist) * 0.12;
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  };
  animate();

  // Mouse interaction — particles near cursor glow
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    particles.forEach(p => {
      const dx = p.x - mx, dy = p.y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 80) {
        p.alpha = Math.min(p.alpha + 0.05, 0.9);
        p.vx += dx / d * 0.05;
        p.vy += dy / d * 0.05;
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────
   8. TYPING ANIMATION
   — Cycles through role titles with typewriter effect
   ───────────────────────────────────────────────────────── */
function initTypingAnimation() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const roles = [
    'Cybersecurity Enthusiast',
    'Ethical Hacking Learner',
    'Web Developer',
    'SOC Analyst Aspirant',
    'CTF Player',
    'Python Scripter',
    'Network Security Geek',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  const TYPING_SPEED = 80;
  const DELETE_SPEED = 45;
  const PAUSE_END = 1800;
  const PAUSE_START = 300;

  const type = () => {
    if (paused) return;
    const current = roles[roleIdx];

    if (deleting) {
      // Remove character
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        paused = true;
        setTimeout(() => { paused = false; }, PAUSE_START);
      }
      setTimeout(type, DELETE_SPEED);
    } else {
      // Add character
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        paused = true;
        setTimeout(() => { paused = false; setTimeout(type, DELETE_SPEED); }, PAUSE_END);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    }
  };

  type();
}

/* ─────────────────────────────────────────────────────────
   9. THEME TOGGLE — dark ↔ light mode
   ───────────────────────────────────────────────────────── */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;

  if (!btn) return;

  // Load saved preference
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/* ─────────────────────────────────────────────────────────
   10. SCROLL REVEAL — animate elements as they enter viewport
   ───────────────────────────────────────────────────────── */
function initScrollReveal() {
  const revealClasses = ['.reveal-up', '.reveal-left', '.reveal-right'];
  const elements = document.querySelectorAll(revealClasses.join(','));

  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────
   11. SKILL BARS — animate progress bars when visible
   ───────────────────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-card__bar[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        // Small delay for a staggered feel
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 150);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ─────────────────────────────────────────────────────────
   12. SKILLS TABS — switch between categories
   ───────────────────────────────────────────────────────── */
function initSkillsTabs() {
  const tabs = document.querySelectorAll('.skills__tab');
  const panels = document.querySelectorAll('.skills__panel');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tab buttons
      tabs.forEach(t => t.classList.toggle('active', t === tab));

      // Update panels
      panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${target}`);
      });

      // Re-trigger skill bar animations for newly visible panel
      setTimeout(() => {
        const activeBars = document.querySelectorAll(`#tab-${target} .skill-card__bar`);
        activeBars.forEach(bar => {
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width') + '%';
          }, 50);
        });
      }, 50);
    });
  });
}

/* ─────────────────────────────────────────────────────────
   13. PROJECT FILTERS — show/hide cards by category
   ───────────────────────────────────────────────────────── */
function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      buttons.forEach(b => b.classList.toggle('active', b === btn));

      // Filter cards with smooth animation
      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          // Force reflow then fade in
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9) translateY(20px)';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────
   14. ANIMATED COUNTERS — count up numbers on scroll
   ───────────────────────────────────────────────────────── */
function animateCounter(el, target, duration = 2000, suffix = '') {
  let start = null;
  const startVal = 0;
  const easeOut = t => 1 - Math.pow(1 - t, 3); // cubic ease-out

  const step = timestamp => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOut(progress);
    const current = Math.floor(eased * (target - startVal) + startVal);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix;
    }
  };

  requestAnimationFrame(step);
}

/* Counter observers — for cyber-stats section */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.cyber-stats__num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* Hero stat counters */
function initHeroCounters() {
  const stats = document.querySelectorAll('.hero__stat-num[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCounter(el, target, 1500);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  stats.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────
   15. CONTACT FORM — validation + fake send
   ───────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name: { el: form.querySelector('#name'), errorEl: form.querySelector('#name-error'), validate: v => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.' },
    email: { el: form.querySelector('#email'), errorEl: form.querySelector('#email-error'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    subject: { el: form.querySelector('#subject'), errorEl: form.querySelector('#subject-error'), validate: v => v.trim().length >= 3 ? '' : 'Subject is too short.' },
    message: { el: form.querySelector('#message'), errorEl: form.querySelector('#message-error'), validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' },
  };

  const successMsg = document.getElementById('form-success');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitText = submitBtn?.querySelector('span:first-of-type');
  const spinner = submitBtn?.querySelector('.btn__loading');

  // Real-time validation on blur
  Object.values(fields).forEach(({ el, errorEl, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const err = validate(el.value);
      errorEl.textContent = err;
      el.classList.toggle('error', !!err);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const err = validate(el.value);
        errorEl.textContent = err;
        el.classList.toggle('error', !!err);
      }
    });
  });

  // Submit handler
  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;
    Object.values(fields).forEach(({ el, errorEl, validate }) => {
      if (!el) return;
      const err = validate(el.value);
      errorEl.textContent = err;
      el.classList.toggle('error', !!err);
      if (err) valid = false;
    });

    if (!valid) return;

    // Fake loading state
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.style.display = 'none';
    if (spinner) spinner.style.display = 'inline';

    setTimeout(() => {
      // Fake success
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.style.display = '';
      if (spinner) spinner.style.display = 'none';
      if (successMsg) { successMsg.style.display = 'flex'; successMsg.style.alignItems = 'center'; successMsg.style.gap = '10px'; }
      form.reset();

      // Hide success after 5s
      setTimeout(() => {
        if (successMsg) successMsg.style.display = 'none';
      }, 5000);
    }, 1800);
  });
}

/* ─────────────────────────────────────────────────────────
   16. BACK TO TOP BUTTON
   ───────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────────────────────
   17. TERMINAL WIDGET
   — Toggleable fake terminal with interactive commands
   ───────────────────────────────────────────────────────── */
function initTerminalWidget() {
  const toggle = document.getElementById('terminal-toggle');
  const widget = document.getElementById('terminal-widget');
  const closeBtn = document.getElementById('terminal-close');
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');

  if (!toggle || !widget) return;

  // Show/hide terminal
  toggle.addEventListener('click', () => {
    widget.classList.toggle('visible');
    if (widget.classList.contains('visible')) {
      // Restart typing animation
      typeTerminalIntro();
      setTimeout(() => input?.focus(), 400);
    }
  });

  closeBtn?.addEventListener('click', () => {
    widget.classList.remove('visible');
  });

  // Terminal intro typing effect
  let terminalTypingIdx = 0;
  const terminalCmds = ['ls projects/', 'cat readme.md', 'nmap -sV localhost', 'python3 scan.py'];

  function typeTerminalIntro() {
    const typingEl = document.getElementById('terminal-typing');
    if (!typingEl) return;

    const cmd = terminalCmds[terminalTypingIdx % terminalCmds.length];
    terminalTypingIdx++;

    let i = 0;
    typingEl.textContent = ' ';

    const type = () => {
      if (i < cmd.length) {
        typingEl.textContent = ' ' + cmd.slice(0, ++i);
        setTimeout(type, 70 + Math.random() * 40);
      }
    };
    type();
  }

  // Interactive commands
  const COMMANDS = {
    whoami: 'Ranjan Aryal — BCSIT Student & Cybersecurity Enthusiast',
    help: 'Commands: whoami | skills | projects | contact | clear | matrix | date | uname',
    skills: 'Python | JavaScript | Linux | Nmap | Burp Suite | Wireshark | Git | MySQL',
    projects: 'Port Scanner | Password Checker | Secure Login | Packet Sniffer | CTF Blog',
    contact: 'Email: ranjan123aryal@gmail.com | GitHub: RanjanAryal | LinkedIn: in/alexcipher',
    date: () => new Date().toString(),
    uname: 'CyberOS v2.4.1 #1 SMP x86_64 GNU/Linux',
    clear: '__CLEAR__',
    matrix: 'Entering the Matrix... [ESC to exit]',
    ls: 'projects/  skills.txt  resume.pdf  ctf-writeups/  README.md',
    pwd: '/home/alexcipher',
    ping: 'PING cyberlab.dev: 64 bytes from 1.2.3.4: icmp_seq=1 ttl=64 time=1.337 ms',
    cat: 'Usage: cat <file> — try: cat skills.txt',
    hack: '>_< Nice try. Try: nmap -sV localhost',
    nmap: 'Starting Nmap 7.93 — 1000 ports scanned — 3 open: 22/ssh, 80/http, 443/https',
    sudo: '[sudo] password for alexcipher: *** Permission denied.',
    exit: 'Closing terminal... Goodbye!',
  };

  input?.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;

    const raw = input.value.trim();
    if (!raw) return;

    const cmd = raw.toLowerCase().split(' ')[0];
    const args = raw.split(' ').slice(1).join(' ');
    let response = COMMANDS[cmd] ?? `Command not found: ${cmd}. Type 'help' for available commands.`;
    if (typeof response === 'function') response = response();

    // Build and append new line + output
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-widget__line';
    lineEl.innerHTML = `<span class="terminal-widget__prompt">root@cyberlab:~$</span><span class="terminal-widget__cmd"> ${escapeHtml(raw)}</span>`;

    if (response === '__CLEAR__') {
      // Clear terminal body but keep the prompt
      body.innerHTML = '';
      body.appendChild(lineEl);
    } else {
      const outEl = document.createElement('div');
      outEl.className = 'terminal-widget__output';
      outEl.textContent = response;
      body.appendChild(lineEl);
      body.appendChild(outEl);
    }

    // Auto-scroll to bottom
    body.scrollTop = body.scrollHeight;
    input.value = '';

    // Close if user types exit
    if (cmd === 'exit') {
      setTimeout(() => widget.classList.remove('visible'), 800);
    }
  });

  // Command history with arrow keys
  const history = [];
  let histIdx = -1;

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      history.unshift(input.value.trim());
      histIdx = -1;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      histIdx = Math.min(histIdx + 1, history.length - 1);
      input.value = history[histIdx] || '';
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      histIdx = Math.max(histIdx - 1, -1);
      input.value = histIdx === -1 ? '' : history[histIdx];
    }
  });
}

/* HTML escape helper */
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ─────────────────────────────────────────────────────────
   18. FOOTER YEAR — auto-update copyright year
   ───────────────────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─────────────────────────────────────────────────────────
   19. BONUS — MATRIX RAIN on Skills Section background
   — A subtle canvas-based matrix char rain behind skills
   ───────────────────────────────────────────────────────── */
(function matrixRainBg() {
  // Inject a canvas into the skills section for a subtle matrix bg
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'matrix-bg';
  skillsSection.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;

  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
  const FONT_SIZE = 13;

  const init = () => {
    W = canvas.width = skillsSection.offsetWidth;
    H = canvas.height = skillsSection.offsetHeight;
    cols = Math.floor(W / FONT_SIZE);
    drops = Array(cols).fill(1);
  };

  const draw = () => {
    ctx.fillStyle = 'rgba(5, 10, 20, 0.05)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#0a84ff';
    ctx.font = `${FONT_SIZE}px 'Share Tech Mono', monospace`;

    drops.forEach((y, i) => {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE);

      if (y * FONT_SIZE > H && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  };

  init();
  window.addEventListener('resize', init, { passive: true });

  // Only animate when visible to save CPU
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        canvas._matrixInterval = setInterval(draw, 60);
      } else {
        clearInterval(canvas._matrixInterval);
      }
    });
  });
  observer.observe(skillsSection);
})();

/* ─────────────────────────────────────────────────────────
   20. KEYBOARD SHORTCUT — Konami Code Easter Egg
   — Up Up Down Down Left Right Left Right B A → glitch effect
   ───────────────────────────────────────────────────────── */
(function konamiEasterEgg() {
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let idx = 0;

  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[idx]) {
      idx++;
      if (idx === KONAMI.length) {
        idx = 0;
        triggerGlitch();
      }
    } else {
      idx = 0;
    }
  });

  function triggerGlitch() {
    document.body.style.animation = 'none';
    const msg = document.createElement('div');
    msg.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.85);
      z-index:99999; display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      font-family:'Share Tech Mono',monospace; color:#00d4ff;
      font-size:clamp(1rem,3vw,1.6rem); text-align:center; padding:24px;
      animation: fade-in 0.3s ease;
    `;
    msg.innerHTML = `
      <div style="font-size:3rem;margin-bottom:16px">🔓</div>
      <div style="color:#00ff88; font-size:1.1em; margin-bottom:8px">// KONAMI CODE ACTIVATED</div>
      <div>Access Level: <span style="color:#ff4444">ADMINISTRATOR</span></div>
      <div style="margin-top:12px;font-size:0.75em;color:#5a6373">
        You found the easter egg! 🏆<br>
        <span style="color:#00d4ff">Root access granted... just kidding 😄</span>
      </div>
      <button onclick="this.parentElement.remove()" style="
        margin-top:24px;padding:10px 28px;border-radius:8px;
        background:linear-gradient(135deg,#0550ae,#00d4ff);
        border:none;color:#fff;cursor:pointer;font-family:inherit;
        font-size:0.9rem;letter-spacing:0.05em;
      ">[ CLOSE ]</button>
    `;
    document.body.appendChild(msg);
    // Auto-remove after 8s
    setTimeout(() => msg.remove(), 8000);
  }
})();

/* ─────────────────────────────────────────────────────────
   21. CURSOR GLOW EFFECT — subtle cyan glow follows cursor
   ───────────────────────────────────────────────────────── */
(function cursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 9998;
    transition: opacity 0.3s;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  let mx = -500, my = -500;
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top = my + 'px';
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
})();

/* ─────────────────────────────────────────────────────────
   22. CARD TILT EFFECT — subtle 3D tilt on glass cards
   ───────────────────────────────────────────────────────── */
(function cardTilt() {
  const cards = document.querySelectorAll('.glass-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;  // max 6deg
      const rotY = ((x - cx) / cx) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.3s, box-shadow 0.3s';
    });
  });
})();



/* ─────────────────────────────────────────────────────────
   24. PROJECT CARD HOVER EFFECT — stagger animation reset
   ───────────────────────────────────────────────────────── */
(function projectHoverFix() {
  // Make sure hidden project cards don't take up layout space
  const style = document.createElement('style');
  style.textContent = `
    .project-card {
      transition: opacity 0.3s ease, transform 0.3s ease,
                  border-color 0.3s, box-shadow 0.3s;
    }
    .project-card.hidden { display: none !important; }
  `;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────────────────────
   25. PERFORMANCE — requestIdleCallback polyfill
   — Used for non-critical initializations
   ───────────────────────────────────────────────────────── */
window.requestIdleCallback = window.requestIdleCallback || function (cb) {
  const start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    });
  }, 1);
};

/* ─────────────────────────────────────────────────────────
   26. INIT COMPLETE LOG
   ───────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  console.log('%c[CYBER_DEV] Portfolio initialized successfully ✓', 'color:#00d4ff; font-family:monospace; font-size:13px;');
  console.log('%cTry the Konami Code: ↑↑↓↓←→←→BA 👾', 'color:#00ff88; font-family:monospace; font-size:11px;');
});

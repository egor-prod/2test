const body = document.body;
const header = document.querySelector('.site-header');
const progressBar = document.querySelector('.progress-bar');
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('a[href^="#"]');
const fadeElements = document.querySelectorAll('.fade-in');
const worksSlider = document.querySelector('.works-slider');
const sliderButtons = document.querySelectorAll('.slider-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const modalBody = document.querySelector('.modal-body');
const showreelTriggers = document.querySelectorAll('.open-showreel, .showreel-player');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const stepCards = document.querySelectorAll('.step-card');
const heroParallax = document.querySelectorAll('[data-parallax]');
const contactForm = document.querySelector('#contact-form');

// Burger menu
burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('active');
  body.classList.toggle('menu-open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

mobileMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    mobileMenu.classList.remove('open');
    burger.classList.remove('active');
    body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', false);
    mobileMenu.setAttribute('aria-hidden', true);
  }
});

// Smooth scroll
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      mobileMenu.classList.remove('open');
      burger.classList.remove('active');
      body.classList.remove('menu-open');
    }
  });
});

// Header on scroll & progress bar
const updateProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${progress}%`;
  if (scrollTop > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', updateProgress);
updateProgress();

// Intersection animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeElements.forEach((el) => observer.observe(el));

// Slider controls
const scrollSlider = (direction = 1) => {
  if (!worksSlider) return;
  const card = worksSlider.querySelector('.work-card:not([hidden])');
  const width = card ? card.getBoundingClientRect().width + 16 : 320;
  worksSlider.scrollBy({ left: width * direction, behavior: 'smooth' });
};

sliderButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    scrollSlider(btn.classList.contains('next') ? 1 : -1);
  });
});

// Filters
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.dataset.filter;
    document.querySelectorAll('.work-card').forEach((card) => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
    });
  });
});

// Modal helpers
const openModal = (html) => {
  modalBody.innerHTML = html;
  modal.classList.add('open');
  body.classList.add('modal-open');
};

const closeModal = () => {
  modal.classList.remove('open');
  body.classList.remove('modal-open');
  modalBody.innerHTML = '';
};

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Showreel modal
showreelTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    openModal(`
      <h3>Шоурил «ВАЖНО» 2025</h3>
      <iframe src="https://player.vimeo.com/video/76979871" allowfullscreen></iframe>
      <p>Киноистории, которые мы создали в прошлом году: от ярких кампаний до документальных короткометражек.</p>
    `);
  });
});

// Work cards modal
worksSlider?.addEventListener('click', (e) => {
  const card = e.target.closest('.work-card');
  if (!card) return;
  const { title, description, video, credits } = card.dataset;
  openModal(`
    <h3>${title}</h3>
    <iframe src="${video}" allowfullscreen></iframe>
    <p>${description}</p>
    <p class="credits">${credits}</p>
  `);
});

// Talents modal
const talentGrid = document.querySelector('.talent-grid');
talentGrid?.addEventListener('click', (e) => {
  const card = e.target.closest('.talent-card');
  if (!card) return;
  const { name, role, bio, projects, mail } = card.dataset;
  const projectList = projects.split(';').map((p) => `<li>${p}</li>`).join('');
  openModal(`
    <h3>${name}</h3>
    <p><strong>${role}</strong></p>
    <p>${bio}</p>
    <h4>Ключевые проекты</h4>
    <ul>${projectList}</ul>
    <a class="btn primary" href="mailto:${mail}">Написать продюсеру</a>
  `);
});

// Tabs
const switchTab = (tab) => {
  tabButtons.forEach((btn) => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.tab === tab);
  });
};

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Process highlighting
const processObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-active');
    } else {
      entry.target.classList.remove('is-active');
    }
  });
}, { threshold: 0.5 });

stepCards.forEach((card) => processObserver.observe(card));

// Parallax
const parallax = () => {
  const scroll = window.scrollY;
  heroParallax.forEach((el) => {
    const speed = 0.15;
    el.style.transform = `translateY(${scroll * speed}px)`;
  });
};
window.addEventListener('scroll', parallax);

// Form validation
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const topic = form.topic.value;
  const message = form.message.value.trim();
  const consent = form.consent.checked;
  const messageBox = form.querySelector('.form-message');

  const showError = (text) => {
    messageBox.textContent = text;
    messageBox.className = 'form-message error';
  };

  const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email);

  if (!name) return showError('Введите имя.');
  if (!emailValid) return showError('Укажите корректный e-mail.');
  if (!topic) return showError('Выберите тип запроса.');
  if (!message) return showError('Опишите задачу.');
  if (!consent) return showError('Нужно согласиться на обработку данных.');

  form.reset();
  messageBox.textContent = 'Спасибо! Мы получили ваше сообщение и свяжемся с вами.';
  messageBox.className = 'form-message success';
});

// Scroll top offset fix for anchor focus
window.addEventListener('hashchange', () => {
  const target = document.querySelector(window.location.hash);
  if (target) target.focus({ preventScroll: true });
});

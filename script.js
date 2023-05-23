
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const navLink = document.querySelectorAll('.nav__link');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
//
const slidesContainer = document.querySelector('.slider');
// slidesContainer.style.overflow = 'visible';
// slidesContainer.style.transform = 'scale(0.5) translateX(-700px)';
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');
//
//
////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//
//
////////////////////////
// page Navigation
// 1. smooth Scroll

navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// 2. scroll Effect
nav.addEventListener('mouseover', handleHover.bind(0.4));

nav.addEventListener('mouseout', handleHover.bind(1));

// 3. sticky navbar
const headerCallBack = function (entries) {
  if (entries[0].isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};
let navHeight = nav.getBoundingClientRect().height;
const headerObs = new IntersectionObserver(headerCallBack, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObs.observe(header);
//
//
////////////////////////
// Reveal Sections
const sectionsAll = document.querySelectorAll('.section');

const sectionReveal = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionReveal, {
  root: null,
  threshold: 0.2,
});
sectionsAll.forEach(function (sec) {
  sectionObserver.observe(sec);
  // sec.classList.add('section--hidden');
});
//
//
////////////////////////
// Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const lazyLoad = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 1,
});
imgTargets.forEach(img => lazyLoad.observe(img));
//
//
////////////////////////
// Opreations Tabbed Components

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const activeTab = e.target.closest('button');

  if (!activeTab) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  activeTab.classList.add('operations__tab--active');

  tabContent.forEach(i => i.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${activeTab.dataset.tab}`)
    .classList.add('operations__content--active');
});

//
//
////////////////////////
// Slider
const sliderContent = function () {
  let curSlide = 0;
  let maxSlide = slides.length;

  // creating dots
  const createDots = function () {
    slides.forEach(function (s, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Activating Dot
  const activateDot = function (currentSlide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
      .classList.add('dots__dot--active');
  };
  // putting slides side by side
  const GoToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Got to next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    GoToSlide(curSlide);
    activateDot(curSlide);
  };

  // Got to Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    GoToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    GoToSlide(0);
    activateDot(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      GoToSlide(slide);
      activateDot(curSlide);
    }
  });
};
sliderContent();

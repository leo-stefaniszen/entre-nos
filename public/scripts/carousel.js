const initCarousel = (carousel) => {
  const trackViewport = carousel.querySelector('[data-track]');
  const track = trackViewport?.querySelector('.carousel-track');
  const prev = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');
  const dotsWrap = carousel.parentElement?.querySelector('[data-dots]');
  const slides = Array.from(carousel.querySelectorAll('[data-slide]'));

  if (!trackViewport || !track || slides.length === 0) return;

  let current = 0;
  let timer;

  const updateDots = () => {
    if (!dotsWrap) return;
    [...dotsWrap.children].forEach((dot, index) => {
      dot.setAttribute('aria-current', index === current ? 'true' : 'false');
    });
  };

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    trackViewport.scrollTo({ left: slides[current].offsetLeft, behavior: 'smooth' });
    updateDots();
  };

  const startAuto = () => {
    timer = window.setInterval(() => goTo(current + 1), 4300);
  };

  const stopAuto = () => {
    if (timer) window.clearInterval(timer);
  };

  const moveNext = () => goTo(current + 1);
  const movePrev = () => goTo(current - 1);

  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      dot.setAttribute('aria-label', `Ir para palestrante ${index + 1}`);
      dot.addEventListener('click', () => goTo(index));
      dotsWrap.appendChild(dot);
    });
  }

  prev?.addEventListener('click', movePrev);
  next?.addEventListener('click', moveNext);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      movePrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveNext();
    } else if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof HTMLElement) {
      if (event.target.matches('[data-prev]')) {
        event.preventDefault();
        movePrev();
      }
      if (event.target.matches('[data-next]')) {
        event.preventDefault();
        moveNext();
      }
    }
  };

  carousel.addEventListener('keydown', onKeyDown);
  trackViewport.addEventListener('focus', stopAuto);
  trackViewport.addEventListener('blur', startAuto);
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  goTo(0);
  startAuto();
};

const setupCarousels = () => {
  const carousels = Array.from(document.querySelectorAll('[data-carousel]'));
  if (carousels.length === 0) return;

  carousels.forEach((carousel) => {
    let initialized = false;
    const start = () => {
      if (initialized) return;
      initialized = true;
      initCarousel(carousel);
    };

    if (!('IntersectionObserver' in window)) {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
          }
        });
      },
      { rootMargin: '120px' }
    );

    observer.observe(carousel);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCarousels, { once: true });
} else {
  setupCarousels();
}

const setupNextSectionButton = () => {
  const button = document.querySelector('[data-next-section]');
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  if (!(button instanceof HTMLButtonElement)) return;
  if (sections.length < 2) {
    button.style.display = 'none';
    return;
  }

  const getCurrentSectionIndex = () => {
    const marker = window.scrollY + window.innerHeight * 0.45;
    let activeIndex = 0;

    sections.forEach((section, index) => {
      if (section.offsetTop <= marker) activeIndex = index;
    });

    return activeIndex;
  };

  const updateButton = () => {
    const index = getCurrentSectionIndex();
    const isLast = index >= sections.length - 1;
    button.textContent = isLast ? '↑' : '↓';
    button.setAttribute('aria-label', isLast ? 'Voltar ao início' : 'Ir para a próxima seção');
  };

  button.addEventListener('click', () => {
    const index = getCurrentSectionIndex();
    const target = sections[index + 1] ?? sections[0];
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  window.addEventListener('scroll', updateButton, { passive: true });
  window.addEventListener('resize', updateButton);
  updateButton();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupNextSectionButton, { once: true });
} else {
  setupNextSectionButton();
}

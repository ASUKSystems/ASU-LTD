
(() => {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector('[data-header]');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader(); window.addEventListener('scroll', updateHeader, { passive: true });

  const button = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  button?.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('open', !open);
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    button?.setAttribute('aria-expanded','false'); menu?.classList.remove('open');
  }));

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    }), { threshold: .12 });
    revealEls.forEach(el => io.observe(el));
  } else { revealEls.forEach(el => el.classList.add('visible')); }

  const lightbox = document.querySelector('[data-lightbox]');
  if (lightbox) {
    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('[data-lightbox-caption]');
    const close = () => { lightbox.classList.remove('open'); document.body.style.overflow=''; };
    document.querySelectorAll('[data-gallery-item]').forEach(item => item.addEventListener('click', () => {
      image.src = item.dataset.full || item.querySelector('img').src;
      image.alt = item.querySelector('img').alt;
      caption.textContent = item.dataset.caption || image.alt;
      lightbox.classList.add('open'); document.body.style.overflow='hidden';
    }));
    lightbox.querySelector('[data-lightbox-close]')?.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  const form = document.querySelector('[data-enquiry-form]');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = `Seascape holiday enquiry — ${data.get('arrival') || 'dates to confirm'}`;
    const body = [
      `Name: ${data.get('name') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Telephone: ${data.get('phone') || ''}`,
      `Preferred arrival: ${data.get('arrival') || ''}`,
      `Number of nights: ${data.get('nights') || ''}`,
      `Guests: ${data.get('guests') || ''}`,
      '',
      `${data.get('message') || ''}`
    ].join('\n');
    window.location.href = `mailto:info@seascapeholidays.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();

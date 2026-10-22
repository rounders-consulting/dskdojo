document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.main-navigation');
  const toggle = document.querySelector('.menu-toggle');

  const setMenuOpen = (isOpen) => {
    if (!nav || !toggle) return;

    nav.classList.toggle('is-open', isOpen);
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', isOpen);
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', (event) => {
      if (event.target === nav) setMenuOpen(false);
    });

    nav.querySelectorAll('.menu-wrap a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!link.parentElement.classList.contains('menu-item-has-children')) {
          setMenuOpen(false);
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 861 && nav.classList.contains('is-open')) {
        setMenuOpen(false);
      }
    });
  }

  const parentItems = document.querySelectorAll('.menu-item-has-children');
  parentItems.forEach((item) => {
    const link = item.querySelector(':scope > a');

    if (!link || window.innerWidth >= 860) return;

    link.addEventListener('click', (event) => {
      event.preventDefault();
      item.classList.toggle('open');
    });
  });

  const lightbox = document.querySelector('.photo-lightbox');

  if (lightbox && typeof lightbox.showModal === 'function') {
    const lightboxImage = lightbox.querySelector('.photo-lightbox-image');
    const lightboxCaption = lightbox.querySelector('.photo-lightbox-caption');
    const lightboxCount = lightbox.querySelector('.photo-lightbox-count');
    const closeButton = lightbox.querySelector('.photo-lightbox-close');
    const previousButton = lightbox.querySelector('.photo-lightbox-previous');
    const nextButton = lightbox.querySelector('.photo-lightbox-next');
    let activeItems = [];
    let activeIndex = 0;
    let opener = null;

    const showPhoto = () => {
      const item = activeItems[activeIndex];
      const thumbnail = item.querySelector('img');
      const caption = thumbnail ? thumbnail.alt : '';

      lightboxImage.src = item.href;
      lightboxImage.alt = caption;
      lightboxCaption.textContent = caption;
      lightboxCount.textContent = `${activeIndex + 1} / ${activeItems.length}`;
      previousButton.hidden = activeItems.length < 2;
      nextButton.hidden = activeItems.length < 2;
    };

    document.querySelectorAll('.photo-gallery [data-lightbox-item]').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const gallery = item.closest('.photo-gallery');
        activeItems = Array.from(gallery.querySelectorAll('[data-lightbox-item]'));
        activeIndex = activeItems.indexOf(item);
        opener = item;
        showPhoto();
        lightbox.showModal();
        closeButton.focus();
      });
    });

    previousButton.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + activeItems.length) % activeItems.length;
      showPhoto();
    });

    nextButton.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % activeItems.length;
      showPhoto();
    });

    closeButton.addEventListener('click', () => lightbox.close());

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        lightbox.close();
      } else if (event.key === 'ArrowLeft' && activeItems.length > 1) {
        event.preventDefault();
        previousButton.click();
      } else if (event.key === 'ArrowRight' && activeItems.length > 1) {
        event.preventDefault();
        nextButton.click();
      }
    });

    lightbox.addEventListener('close', () => {
      lightboxImage.removeAttribute('src');
      const returnFocus = opener;
      if (returnFocus) requestAnimationFrame(() => returnFocus.focus({ preventScroll: true }));
    });
  }
});

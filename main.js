/**
 * Agent 6: JavaScript Engineer
 * Vanilla JS interactivity for Femina Saloon
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initLightbox();
  initCarousel();
  initBookingForm();
  initBackToTop();
  initScrollReveal();
});

/**
 * Initializes mobile hamburger menu & Focus Trap
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');
  
  if (!toggleBtn || !mobileMenu) return;

  const focusableElements = mobileMenu.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    if (isOpen && firstElement) {
      firstElement.focus();
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) { 
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      toggleMenu();
      toggleBtn.focus();
    }
  });
}



/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 44 + 52;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Gallery Lightbox logic
 */
function initLightbox() {
  const lightbox = document.querySelector('#gallery-lightbox');
  if (!lightbox) return;

  const items = document.querySelectorAll('.gallery__item');
  const lightboxImg = lightbox.querySelector('.lightbox__image');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');
  
  let currentIndex = 0;
  
  const openLightbox = (index) => {
    currentIndex = index;
    lightboxImg.src = items[currentIndex].src;
    lightboxImg.alt = items[currentIndex].alt;
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    items[currentIndex].focus();
  };
  
  const showNext = () => {
    currentIndex = (currentIndex + 1) % items.length;
    lightboxImg.src = items[currentIndex].src;
    lightboxImg.alt = items[currentIndex].alt;
  };
  
  const showPrev = () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    lightboxImg.src = items[currentIndex].src;
    lightboxImg.alt = items[currentIndex].alt;
  };
  
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('gallery__item')) {
        const index = Array.from(items).indexOf(e.target);
        openLightbox(index);
      }
    });
    galleryGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('gallery__item')) {
        const index = Array.from(items).indexOf(e.target);
        openLightbox(index);
      }
    });
  }

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/**
 * Testimonial Carousel auto-play and controls
 */
function initCarousel() {
  const track = document.querySelector('.carousel__track');
  if (!track) return;
  
  const slides = Array.from(track.children);
  if (slides.length === 0) return;

  const nextBtn = document.querySelector('#carousel-next');
  const prevBtn = document.querySelector('#carousel-prev');
  const dots = document.querySelectorAll('.carousel__dot');
  
  let currentIndex = 0;
  let interval;
  
  const updateCarousel = () => {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('is-active');
      } else {
        dot.classList.remove('is-active');
      }
    });
  };
  
  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  };
  
  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  };
  
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  const startAutoplay = () => {
    interval = setInterval(nextSlide, 5000);
  };
  
  const stopAutoplay = () => {
    clearInterval(interval);
  };
  
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }
  
  startAutoplay();
  window.addEventListener('resize', updateCarousel);
}

/**
 * Booking Form multi-step wizard and validation logic
 */
function initBookingForm() {
  const form = document.querySelector('#booking-form');
  if (!form) return;
  
  const steps = Array.from(form.querySelectorAll('.wizard-step'));
  const indicators = Array.from(form.querySelectorAll('.wizard-step-indicator'));
  const nextBtns = form.querySelectorAll('.btn-next');
  const prevBtns = form.querySelectorAll('.btn-prev');
  let currentStep = 0;

  const updateWizard = () => {
    steps.forEach((step, index) => {
      step.classList.toggle('is-active', index === currentStep);
    });
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('is-active', index === currentStep);
    });
  };

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    const inputs = step.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      const errorMsg = input.nextElementSibling;
      if (!input.value.trim() || (input.type === 'email' && !input.checkValidity())) {
        isValid = false;
        input.classList.add('is-error');
        if (errorMsg && errorMsg.classList.contains('form__error-message')) {
          errorMsg.classList.add('is-visible');
        }
      } else {
        input.classList.remove('is-error');
        if (errorMsg && errorMsg.classList.contains('form__error-message')) {
          errorMsg.classList.remove('is-visible');
        }
      }
    });
    return isValid;
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < steps.length - 1) {
          currentStep++;
          updateWizard();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateWizard();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      alert('Booking Confirmed!');
      form.reset();
      currentStep = 0;
      updateWizard();
    }
  });
  
  form.addEventListener('input', (e) => {
    if (e.target.hasAttribute('required')) {
      e.target.classList.remove('is-error');
      const errorMsg = e.target.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains('form__error-message')) {
        errorMsg.classList.remove('is-visible');
      }
    }
  });
}

/**
 * Back to Top button
 */
function initBackToTop() {
  const btt = document.querySelector('#back-to-top');
  if (!btt) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btt.classList.add('is-visible');
    } else {
      btt.classList.remove('is-visible');
    }
  }, { passive: true });
  
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Scroll Reveal Animations
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  reveals.forEach(el => observer.observe(el));
}

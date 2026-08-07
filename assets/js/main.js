/* ===================================
   7 CHANGES ENTERPRISE - LUXURY MAIN JS
   Premium Interactions & Animations
   =================================== */

(function() {
  'use strict';

  /* ===================================
     PRELOADER
     =================================== */
  window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 800);
      }, 1000);
    }
    
    // Trigger hero animations after preloader
    document.body.classList.add('loaded');
  });

  /* ===================================
     CUSTOM CURSOR (Desktop Only)
     =================================== */
  function initCustomCursor() {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const cursor = document.querySelector('.custom-cursor');
      const follower = document.querySelector('.custom-cursor-follower');
      
      if (!cursor || !follower) return;
      
      let mouseX = 0, mouseY = 0;
      let followerX = 0, followerY = 0;
      
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
      });
      
      // Smooth follower animation
      function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
      }
      animateFollower();
      
      // Hover effects for interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .portfolio-item, .video-card-luxury, .service-card-luxury, .subgallery-item, .faq-question-luxury');
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('active');
          follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('active');
          follower.classList.remove('active');
        });
      });
    }
  }

  /* ===================================
     NAVBAR SCROLL EFFECT
     =================================== */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ===================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     =================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse?.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
          }
        }
      });
    });
  }

  /* ===================================
     SCROLL REVEAL ANIMATIONS
     =================================== */
  function initScrollReveal() {
    const revealSelectors = [
      '.reveal-fade-up',
      '.reveal-fade-left',
      '.reveal-fade-right',
      '.reveal',
      '.fade-up'
    ];
    
    const revealElements = document.querySelectorAll(revealSelectors.join(','));
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
      // For .fade-up elements, they animate on load, so only observe others
      if (!el.classList.contains('fade-up')) {
        revealObserver.observe(el);
      }
    });
  }

  /* ===================================
     COUNTER ANIMATION (Stats Section)
     =================================== */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number-luxury.counter, .counter');
    if (counters.length === 0) return;
    
    let countersAnimated = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (isNaN(target)) return;
            
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
              current += increment;
              if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
              } else {
                counter.innerText = target + '+';
              }
            };
            
            updateCounter();
          });
          
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    
    // Observe the stats section
    const statsSection = document.querySelector('.section-stats-luxury, .stats');
    if (statsSection) {
      counterObserver.observe(statsSection);
    } else if (counters.length > 0) {
      counterObserver.observe(counters[0]);
    }
  }

  /* ===================================
     TESTIMONIALS CAROUSEL
     =================================== */
  function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;
    
    const slider = carousel.querySelector('.testimonial-slider');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const slides = carousel.querySelectorAll('.testimonial-card-luxury');
    
    if (!slider || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;
    
    function updateCarousel() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slideCount;
      updateCarousel();
    }
    
    function prevSlide() {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      updateCarousel();
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
    });
    
    // Auto-advance every 6 seconds
    let autoPlay = setInterval(nextSlide, 6000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carousel.addEventListener('mouseleave', () => {
      autoPlay = setInterval(nextSlide, 6000);
    });
  }

  /* ===================================
     FAQ ACCORDION
     =================================== */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item-luxury');
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question-luxury');
      if (!question) return;
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ===================================
     BACK TO TOP BUTTON
     =================================== */
  function initBackToTop() {
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.className = 'back-to-top';
      backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      backToTopBtn.setAttribute('aria-label', 'Back to top');
      document.body.appendChild(backToTopBtn);
    }
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===================================
     LAZY LOADING FALLBACK
     =================================== */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return;
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if (lazyImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      if (img.dataset.src) imageObserver.observe(img);
    });
  }

  /* ===================================
     MOBILE MENU ENHANCEMENTS
     =================================== */
  function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    navbarToggler.addEventListener('click', () => {
      const isShowing = navbarCollapse.classList.contains('show');
      document.body.style.overflow = isShowing ? '' : 'hidden';
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 992 && 
          navbarCollapse.classList.contains('show') && 
          !navbarCollapse.contains(e.target) && 
          !navbarToggler.contains(e.target)) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
        document.body.style.overflow = '';
      }
    });
    
    // Close menu on link click (mobile)
    navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ===================================
     BACK TO GALLERY BUTTON (Sub-pages)
     =================================== */
  function initBackToGallery() {
    const backBtn = document.querySelector('.back-to-gallery-btn');
    if (!backBtn) return;
    
    // Auto-hide when scrolled past hero
    window.addEventListener('scroll', () => {
      const hero = document.querySelector('.page-hero, .subpage-hero');
      if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        if (window.scrollY > heroBottom - 100) {
          backBtn.style.opacity = '0';
          backBtn.style.pointerEvents = 'none';
        } else {
          backBtn.style.opacity = '1';
          backBtn.style.pointerEvents = 'auto';
        }
      }
    });
  }

  /* ===================================
     PARALLAX EFFECT FOR HERO IMAGES
     =================================== */
  function initParallax() {
    const heroImages = document.querySelectorAll('.page-hero-bg, .hero-video');
    if (heroImages.length === 0) return;
    
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      
      heroImages.forEach(img => {
        const parent = img.closest('.page-hero, .hero');
        if (!parent) return;
        
        const parentTop = parent.offsetTop;
        const parentHeight = parent.offsetHeight;
        
        if (scrolled < parentTop + parentHeight) {
          const yPos = (scrolled - parentTop) * 0.4;
          img.style.transform = `translateY(${yPos}px)`;
        }
      });
    }, { passive: true });
  }

  /* ===================================
     IMAGE LOAD ANIMATION
     =================================== */
  function initImageLoadAnimation() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  }

  /* ===================================
     PORTFOLIO FILTER (Gallery Page)
     =================================== */
  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterBtns.length === 0 || portfolioItems.length === 0) return;
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = '';
            setTimeout(() => item.style.opacity = '1', 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });
  }

  /* ===================================
     FORM VALIDATION & SUBMISSION
     =================================== */
  function initFormValidation() {
    const forms = document.querySelectorAll('.luxury-contact-form, .newsletter-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#e74c3c';
            setTimeout(() => input.style.borderColor = '', 3000);
          }
        });
        
        // Don't prevent default for WhatsApp forms
        if (!form.getAttribute('action')?.includes('wa.me')) {
          if (!isValid) {
            e.preventDefault();
          }
        }
      });
    });
  }

  /* ===================================
     CONSOLE WELCOME MESSAGE
     =================================== */
  function showConsoleWelcome() {
    console.log(
      '%c✨ 7 Changes Enterprise %c\n💎 Luxury Event Decor & Rentals\n📍 Kimberley, South Africa\n📱 +27 76 113 5095\n🎨 Colors: Champagne Gold, Sage Green, Charcoal, Ivory',
      'color: #C9A227; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px rgba(201,162,39,0.5); font-family: "Cormorant Garamond", serif;',
      'color: #1B1B1B; font-size: 12px; font-family: "Poppins", sans-serif;'
    );
  }

  /* ===================================
     INITIALIZE ALL MODULES
     =================================== */
  function init() {
    initCustomCursor();
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initTestimonialsCarousel();
    initFAQ();
    initBackToTop();
    initLazyLoad();
    initMobileMenu();
    initBackToGallery();
    initParallax();
    initImageLoadAnimation();
    initPortfolioFilter();
    initFormValidation();
    showConsoleWelcome();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
/* ==========================================================================
   Nomad Ready — Main JavaScript
   Lightbox, Navigation, Accordion, Reviews Toggle, Smooth Scroll
   ========================================================================== */

(function () {
    'use strict';

    // ---------- Sticky Nav (show after scrolling past hero) ----------
    const nav = document.getElementById('nav');
    const hero = document.getElementById('hero');

    function handleNavVisibility() {
        if (!hero || !nav) return;
        const heroBottom = hero.offsetHeight - 100;
        if (window.scrollY > heroBottom) {
            nav.classList.add('nav--visible');
        } else {
            nav.classList.remove('nav--visible');
        }
    }

    window.addEventListener('scroll', handleNavVisibility, { passive: true });
    handleNavVisibility();

    // ---------- Mobile Nav Toggle ----------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('nav__menu--open');
            const isOpen = navMenu.classList.contains('nav__menu--open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('nav__menu--open');
                navToggle.setAttribute('aria-expanded', false);
            });
        });
    }

    // ---------- Lightbox Gallery ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    // Only select gallery items that are NOT feature tiles
    const galleryItems = document.querySelectorAll('.gallery__item:not(.gallery__feature)');
    let currentIndex = 0;
    const galleryImages = [];

    // Build image list (skip feature tiles — they have no <img>)
    galleryItems.forEach(function (item) {
        const img = item.querySelector('img');
        if (img) {
            var imageIndex = galleryImages.length;
            galleryImages.push({
                src: img.src,
                alt: img.alt,
                label: item.querySelector('.gallery__label')?.textContent || ''
            });

            item.addEventListener('click', function () {
                openLightbox(imageIndex);
            });
        }
    });

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('lightbox--active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('lightbox--active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        if (!lightboxImg || !galleryImages[currentIndex]) return;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightboxImg.alt = galleryImages[currentIndex].alt;
        if (lightboxCaption) {
            lightboxCaption.textContent = galleryImages[currentIndex].label;
        }
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    // Lightbox controls
    if (lightbox) {
        var closeBtn = lightbox.querySelector('.lightbox__close');
        var prevBtn = lightbox.querySelector('.lightbox__prev');
        var nextBtn = lightbox.querySelector('.lightbox__next');

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);

        // Click overlay to close
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('lightbox--active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // ---------- Amenities Accordion ----------
    var amenityGroups = document.querySelectorAll('.amenities__group');

    amenityGroups.forEach(function (group) {
        var header = group.querySelector('.amenities__header');
        if (!header) return;

        header.addEventListener('click', function () {
            var isExpanded = group.getAttribute('data-expanded') === 'true';

            // Toggle this group
            if (isExpanded) {
                group.removeAttribute('data-expanded');
                header.setAttribute('aria-expanded', 'false');
            } else {
                group.setAttribute('data-expanded', 'true');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ---------- Reviews Expand / Collapse ----------
    var reviewsToggle = document.getElementById('reviewsToggle');
    var reviewsGrid = document.getElementById('reviewsGrid');

    if (reviewsToggle && reviewsGrid) {
        var reviewsExpanded = false;

        reviewsToggle.addEventListener('click', function () {
            reviewsExpanded = !reviewsExpanded;

            if (reviewsExpanded) {
                reviewsGrid.classList.add('reviews--expanded');
                reviewsToggle.classList.add('reviews__toggle-btn--expanded');
                reviewsToggle.innerHTML = 'Show fewer reviews <svg class="reviews__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="6 9 12 15 18 9"/></svg>';
            } else {
                reviewsGrid.classList.remove('reviews--expanded');
                reviewsToggle.classList.remove('reviews__toggle-btn--expanded');
                reviewsToggle.innerHTML = 'Show all reviews <svg class="reviews__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="6 9 12 15 18 9"/></svg>';

                // Scroll back to reviews section top
                var reviewsSection = document.getElementById('reviews');
                if (reviewsSection) {
                    reviewsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // ---------- Reviewer Avatar Photos ----------
    // Auto-load reviewer photos if they exist in Images/Reviewers/
    document.querySelectorAll('.review-card__avatar[data-reviewer]').forEach(function (avatar) {
        var reviewer = avatar.getAttribute('data-reviewer');
        if (!reviewer) return;

        var img = new Image();
        img.src = 'Images/Reviewers/' + reviewer + '.jpg';
        img.alt = avatar.closest('.review-card')?.querySelector('.review-card__name')?.textContent || '';

        img.onload = function () {
            // Photo exists — replace initials with photo
            avatar.textContent = '';
            avatar.classList.add('review-card__avatar--photo');
            avatar.appendChild(img);
        };
        // If photo doesn't load, initials stay — no error handling needed
    });

    // ---------- Smooth Scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---------- Fade-in on scroll (Intersection Observer) ----------
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections and key elements
    document.querySelectorAll('.about, .gallery, .amenities, .reviews, .location, .contact, .pillar, .review-card:not(.review-card--hidden), .amenities__group').forEach(function (el) {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    // Add fade-in CSS dynamically (avoids FOUC if JS loads late)
    var style = document.createElement('style');
    style.textContent = [
        '.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }',
        '.fade-in.is-visible { opacity: 1; transform: translateY(0); }',
        '.pillar.fade-in { transition-delay: calc(var(--i, 0) * 0.1s); }',
        '.amenities__group.fade-in { transition-delay: calc(var(--i, 0) * 0.1s); }'
    ].join('\n');
    document.head.appendChild(style);

    // Stagger animation delays for pillars and amenity groups
    document.querySelectorAll('.pillar').forEach(function (el, i) {
        el.style.setProperty('--i', i);
    });
    document.querySelectorAll('.amenities__group').forEach(function (el, i) {
        el.style.setProperty('--i', i);
    });

})();

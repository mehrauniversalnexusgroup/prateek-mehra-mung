/* =========================================================
   MUNG FOUNDER WEBSITE — MAIN JS
   Premium, Clean, Lightweight & Mobile-Friendly
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =======================================================
       ELEMENTS
       ======================================================= */

    const html = document.documentElement;
    const body = document.body;

    const navbar = document.querySelector(".navbar");
    const navToggle = document.querySelector(".navbar-toggler");
    const navMenu = document.querySelector(".navbar-collapse");

    const navLinks = Array.from(
        document.querySelectorAll('.navbar .nav-link[href^="#"]')
    );

    const sections = Array.from(
        document.querySelectorAll("section[id]")
    );

    const hero = document.querySelector(".hero-section");
    const cursorGlow = document.querySelector(".cursor-glow");
    const contactForm = document.querySelector(".contact-form form");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const desktopPointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );


    /* =======================================================
       NAVBAR — SCROLL STATE
       ======================================================= */

    function updateNavbar() {
        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    updateNavbar();

    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );


    /* =======================================================
       MOBILE MENU
       ======================================================= */

    function closeMobileMenu() {
        if (!navMenu) return;

        if (
            navMenu.classList.contains("show") &&
            window.bootstrap &&
            window.bootstrap.Collapse
        ) {
            const collapse =
                window.bootstrap.Collapse.getInstance(navMenu) ||
                new window.bootstrap.Collapse(navMenu, {
                    toggle: false
                });

            collapse.hide();
        }

        body.classList.remove("menu-open");

        if (navToggle) {
            navToggle.setAttribute("aria-expanded", "false");
        }
    }


    if (navMenu) {
        navMenu.addEventListener(
            "shown.bs.collapse",
            () => {
                body.classList.add("menu-open");

                if (navToggle) {
                    navToggle.setAttribute(
                        "aria-expanded",
                        "true"
                    );
                }
            }
        );

        navMenu.addEventListener(
            "hidden.bs.collapse",
            () => {
                body.classList.remove("menu-open");

                if (navToggle) {
                    navToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            }
        );
    }


    /* =======================================================
       SMOOTH SCROLLING
       ======================================================= */

    function scrollToSection(target) {
        if (!target) return;

        const navbarHeight = navbar
            ? navbar.offsetHeight
            : 0;

        const offset = navbarHeight + 12;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            offset;

        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: prefersReducedMotion.matches
                ? "auto"
                : "smooth"
        });
    }


    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const href = link.getAttribute("href");

                if (!href || href === "#") {
                    return;
                }

                const target = document.querySelector(href);

                if (!target) {
                    return;
                }

                event.preventDefault();

                closeMobileMenu();

                scrollToSection(target);

                try {
                    history.replaceState(
                        null,
                        "",
                        href
                    );
                } catch (error) {
                    /* Ignore browser restrictions */
                }
            });

        });


    /* =======================================================
       ACTIVE NAVIGATION
       ======================================================= */

    if (
        sections.length &&
        navLinks.length &&
        "IntersectionObserver" in window
    ) {

        const activeObserver =
            new IntersectionObserver(
                entries => {

                    const visibleSections =
                        entries
                            .filter(
                                entry =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );

                    if (!visibleSections.length) {
                        return;
                    }

                    const currentSection =
                        visibleSections[0].target;

                    navLinks.forEach(link => {

                        const href =
                            link.getAttribute("href");

                        const isActive =
                            href ===
                            `#${currentSection.id}`;

                        link.classList.toggle(
                            "active",
                            isActive
                        );

                    });

                },
                {
                    rootMargin:
                        "-30% 0px -60% 0px",

                    threshold: [
                        0.05,
                        0.15,
                        0.3,
                        0.5
                    ]
                }
            );

        sections.forEach(section => {
            activeObserver.observe(section);
        });
    }


    /* =======================================================
       CURSOR GLOW
       DESKTOP ONLY
       ======================================================= */

    if (
        cursorGlow &&
        desktopPointer.matches &&
        !prefersReducedMotion.matches
    ) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let currentX = mouseX;
        let currentY = mouseY;

        let animationFrame = null;

        document.addEventListener(
            "pointermove",
            event => {

                mouseX = event.clientX;
                mouseY = event.clientY;

            },
            { passive: true }
        );


        function animateCursor() {

            currentX +=
                (mouseX - currentX) * 0.12;

            currentY +=
                (mouseY - currentY) * 0.12;

            cursorGlow.style.left =
                `${currentX}px`;

            cursorGlow.style.top =
                `${currentY}px`;

            animationFrame =
                requestAnimationFrame(
                    animateCursor
                );
        }

        animationFrame =
            requestAnimationFrame(
                animateCursor
            );


        window.addEventListener(
            "pagehide",
            () => {
                if (animationFrame) {
                    cancelAnimationFrame(
                        animationFrame
                    );
                }
            }
        );

    } else if (cursorGlow) {

        cursorGlow.style.display = "none";

    }


    /* =======================================================
       HERO MOUSE PARALLAX
       DESKTOP ONLY
       ======================================================= */

    if (
        hero &&
        desktopPointer.matches &&
        !prefersReducedMotion.matches
    ) {

        let frame = null;

        let mouseOffsetX = 0;
        let mouseOffsetY = 0;


        hero.addEventListener(
            "pointermove",
            event => {

                const rect =
                    hero.getBoundingClientRect();

                if (!rect.width || !rect.height) {
                    return;
                }

                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;

                mouseOffsetX = x;
                mouseOffsetY = y;

                if (frame) return;

                frame =
                    requestAnimationFrame(() => {

                        html.style.setProperty(
                            "--mouse-x",
                            `${mouseOffsetX * -8}px`
                        );

                        html.style.setProperty(
                            "--mouse-y",
                            `${mouseOffsetY * -6}px`
                        );

                        frame = null;
                    });

            },
            { passive: true }
        );


        hero.addEventListener(
            "pointerleave",
            () => {

                html.style.setProperty(
                    "--mouse-x",
                    "0px"
                );

                html.style.setProperty(
                    "--mouse-y",
                    "0px"
                );

            }
        );

    }


    /* =======================================================
       REVEAL ANIMATIONS
       ======================================================= */

    const revealSelectors = [
        ".section-heading",
        ".about-content",
        ".founder-card",
        ".vision-content",
        ".vision-quote-card",
        ".leadership-card",
        ".journey-card",
        ".ecosystem-card",
        ".roadmap-card",
        ".contact-info",
        ".contact-form",
        ".footer-brand",
        ".footer-links",
        ".footer-connect"
    ];


    const revealElements = Array.from(
        document.querySelectorAll(
            revealSelectors.join(",")
        )
    );


    revealElements.forEach(element => {
        element.classList.add("js-reveal");
    });


    if (
        prefersReducedMotion.matches ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });

    } else {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    }


    /* =======================================================
       STAGGERED CARDS
       ======================================================= */

    const staggerGroups = [
        ".ecosystem-card",
        ".leadership-card",
        ".journey-card",
        ".roadmap-card"
    ];


    staggerGroups.forEach(selector => {

        const cards =
            Array.from(
                document.querySelectorAll(selector)
            );

        cards.forEach((card, index) => {

            card.style.setProperty(
                "--reveal-delay",
                `${Math.min(index * 70, 420)}ms`
            );

        });

    });


    /* =======================================================
       CONTACT FORM
       ======================================================= */

    if (contactForm) {

        const submitButton =
            contactForm.querySelector(
                'button[type="submit"]'
            );


        contactForm.addEventListener(
            "submit",
            event => {

                if (!contactForm.checkValidity()) {
                    return;
                }

                if (!submitButton) {
                    return;
                }

                submitButton.disabled = true;

                submitButton.classList.add(
                    "is-loading"
                );


                if (
                    !submitButton.dataset.originalHtml
                ) {

                    submitButton.dataset.originalHtml =
                        submitButton.innerHTML;

                }


                submitButton.innerHTML =
                    'Sending <i class="bi bi-arrow-repeat" aria-hidden="true"></i>';

            }
        );


        window.addEventListener(
            "pageshow",
            () => {

                if (!submitButton) {
                    return;
                }

                submitButton.disabled = false;

                submitButton.classList.remove(
                    "is-loading"
                );


                if (
                    submitButton.dataset.originalHtml
                ) {

                    submitButton.innerHTML =
                        submitButton.dataset.originalHtml;

                }

            }
        );

    }


    /* =======================================================
       EXTERNAL LINKS
       ======================================================= */

    document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach(link => {

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        });


    /* =======================================================
       KEYBOARD ACCESSIBILITY
       ======================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeMobileMenu();
            }

        }
    );


    /* =======================================================
       RESIZE HANDLING
       ======================================================= */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer =
                setTimeout(() => {

                    if (window.innerWidth > 991) {

                        body.classList.remove(
                            "menu-open"
                        );

                    }


                    if (
                        window.innerWidth <= 991
                    ) {

                        html.style.setProperty(
                            "--mouse-x",
                            "0px"
                        );

                        html.style.setProperty(
                            "--mouse-y",
                            "0px"
                        );

                    }

                }, 150);

        },
        { passive: true }
    );


    /* =======================================================
       HANDLE HASH ON INITIAL LOAD
       ======================================================= */

    if (window.location.hash) {

        const initialTarget =
            document.querySelector(
                window.location.hash
            );

        if (initialTarget) {

            setTimeout(() => {

                const navbarHeight =
                    navbar
                        ? navbar.offsetHeight
                        : 0;

                const position =
                    initialTarget.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    navbarHeight -
                    12;

                window.scrollTo({
                    top: Math.max(
                        0,
                        position
                    ),
                    behavior: "auto"
                });

            }, 80);

        }

    }


    /* =======================================================
       VISIBILITY CHANGE
       ======================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden &&
                cursorGlow
            ) {

                cursorGlow.style.opacity =
                    "0";

            } else if (
                cursorGlow
            ) {

                cursorGlow.style.opacity =
                    "";

            }

        }
    );


    /* =======================================================
       FINAL INITIALIZATION
       ======================================================= */

    updateNavbar();

});
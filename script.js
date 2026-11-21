/* ============================================================
   Geeta — Portfolio interactions
   ============================================================ */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Current year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const setMenu = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    setMenu(!links.classList.contains("open"));
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) setMenu(false);
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".count");

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.target || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    };

    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if ("IntersectionObserver" in window && !prefersReduced) {
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              countObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => countObserver.observe(el));
    } else {
      counters.forEach((el) => {
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        el.textContent = parseFloat(el.dataset.target || "0").toFixed(decimals);
      });
    }
  }

  /* ---------- Skill bars ---------- */
  const bars = document.querySelectorAll(".skill-track i");

  bars.forEach((bar) => {
    bar.style.setProperty("--level", `${bar.dataset.level || 100}%`);
  });

  if (bars.length && "IntersectionObserver" in window && !prefersReduced) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = `${entry.target.dataset.level || 100}%`;
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((bar) => barObserver.observe(bar));
  } else {
    bars.forEach((bar) => {
      bar.style.width = `${bar.dataset.level || 100}%`;
    });
  }

  /* ---------- Active nav link ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navAnchors = Array.from(links.querySelectorAll('a[href^="#"]:not(.btn)'));

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const linkFor = (id) => navAnchors.find((a) => a.getAttribute("href") === `#${id}`);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkFor(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Card spotlight ---------- */
  if (!prefersReduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  if (form) {
    const fields = {
      name: form.querySelector("#name"),
      email: form.querySelector("#email"),
      message: form.querySelector("#message"),
    };

    const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

    const validate = () => {
      let valid = true;

      Object.entries(fields).forEach(([key, input]) => {
        let ok = input.value.trim().length > 0;

        if (key === "name" && input.value.trim().length < 2) ok = false;
        if (key === "email") ok = emailOk(input.value);
        if (key === "message" && input.value.trim().length < 10) ok = false;

        input.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      return valid;
    };

    Object.values(fields).forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("invalid");
        if (note) {
          note.classList.remove("success");
          note.textContent = "This opens your email app with the message ready to send.";
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!validate()) {
        note.textContent = "Please fill in your name, a valid email and a short message.";
        note.classList.remove("success");
        return;
      }

      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const message = fields.message.value.trim();

      const subject = encodeURIComponent(`Project enquiry — ${name}`);
      const body = encodeURIComponent(
        `Hi Geeta,\n\n${message}\n\n— ${name}\n${email}`
      );

      note.textContent = "Opening your email app…";
      note.classList.add("success");

      window.location.href = `mailto:geeta29181999@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();

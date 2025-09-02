document.addEventListener("DOMContentLoaded", () => {
  // --- Sticky Header beim Scrollen ---
  const header = document.querySelector(".site-header");
  const heroSection = document.querySelector(".hero");

  if (header && heroSection) {
    // Funktion zur Aktualisierung des Header-Paddings für die erste Sektion
    const updateHeroPadding = () => {
      const headerHeight = header.offsetHeight;
      heroSection.style.paddingTop = `${headerHeight + 20}px`; // Headerhöhe + etwas Puffer
    };

    // Initiales Padding setzen
    updateHeroPadding();

    // Event Listener für Scroll-Effekt
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });

    // Event Listener für Resize, um Padding anzupassen, falls Header-Höhe sich ändert (z.B. durch responsive Anpassungen)
    window.addEventListener("resize", updateHeroPadding);
  }

  // Grundlegende Elemente der Seite
  const burger = document.getElementById("burger-menu");
  const overlay = document.getElementById("nav-overlay");
  const nav = document.getElementById("main-nav");
  const body = document.body;

  // --- Funktion zum Öffnen und Schließen des mobilen Menüs ---
  function toggleNav(force) {
    const willOpen = typeof force === "boolean" ? force : !body.classList.contains("nav-open");
    body.classList.toggle("nav-open", willOpen);
    overlay.hidden = !willOpen;
    burger.setAttribute("aria-expanded", String(willOpen));
  }

  // Event Listener für Burger-Button und Overlay
  burger?.addEventListener("click", () => toggleNav());
  overlay?.addEventListener("click", () => toggleNav(false));

  // --- Gezielte Logik NUR für Klicks in der mobilen Navigation ---
  nav?.addEventListener('click', (e) => {
    const link = e.target.closest('a.nav-link');
    if (!link) return;

    e.preventDefault();
    const href = link.getAttribute('href');
    const targetElement = document.querySelector(href);
    if (!targetElement) return;

    toggleNav(false);

    // Etwas Verzögerung, damit die Navigationsschließ-Animation sichtbar ist
    setTimeout(() => {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 150); // Kann an die Dauer der Off-Canvas-Animation angepasst werden
  });

  // --- Sanftes Scrollen für alle anderen Anker-Links (Desktop, Hero-Buttons etc.) ---
  document.addEventListener('click', (e) => {
    if (e.target.closest('#main-nav')) return; // Klicks im mobilen Menü ignorieren

    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    const targetElement = document.querySelector(href);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });


  // --- Hero Animation beim Laden der Seite ---
  const animatedHeroElements = document.querySelectorAll(".reveal-text");
  const heroStripes = document.querySelector(".hero-stripes");

  // Stufenweise Animation der Textelemente im Hero-Bereich
  animatedHeroElements.forEach((el, index) => {
    el.style.animationDelay = `${0.2 + index * 0.2}s`;
    el.classList.add("animate");
  });

  // Animation der Streifen mit einer festen Verzögerung starten
  if (heroStripes) {
    setTimeout(() => {
      heroStripes.classList.add("animate");
    }, 400); // Startet, nachdem die ersten Textelemente erscheinen
  }


  // --- Service Cards: Klick scrollt zu Anfrage ---
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      const anfrage = document.getElementById("anfrage");
      if (anfrage) anfrage.scrollIntoView({ behavior: "smooth", block: "start" });
      toggleNav(false); // Mobile Nav schließen, falls offen
    });
  });

  // --- Scroll-Animation für Service-Karten und andere Sektionen (Fade-in) ---
  const animatedSections = document.querySelectorAll(".fade-in, .service-card");
  if ("IntersectionObserver" in window && animatedSections.length) {
    const observerOptions = {
      root: null, // viewport als root
      rootMargin: "0px",
      threshold: 0.15 // 15% des Elements sichtbar
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Animation nur einmal abspielen
        }
      });
    }, observerOptions);

    animatedSections.forEach((el) => sectionObserver.observe(el));
  } else {
    // Fallback für Browser, die IntersectionObserver nicht unterstützen
    animatedSections.forEach((el) => el.classList.add("visible"));
  }


  // === Preisrechner ===
  const form = document.getElementById("taxi-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const km = parseFloat(document.getElementById("kilometer").value);
      const uhrzeit = document.getElementById("uhrzeit").value;
      if (isNaN(km) || km <= 0 || !uhrzeit) { alert("Bitte Kilometerzahl und Uhrzeit korrekt eingeben."); return; }
      
      const grundpreis = 4.2; // Beispiel Grundpreis
      const kmPreisTag = 2.5; // Beispiel Preis pro km Tag
      const kmPreisNacht = 2.9; // Beispiel Preis pro km Nacht

      const [hh] = uhrzeit.split(":").map((n) => parseInt(n, 10));
      const nacht = hh >= 22 || hh < 6; // Nacht von 22:00 bis 05:59

      const preis = grundpreis + km * (nacht ? kmPreisNacht : kmPreisTag);

      document.getElementById("distanz").textContent = `${km.toFixed(1)} km`;
      document.getElementById("tarif").textContent = nacht ? "Nacht-/Feiertagstarif (Beispiel)" : "Tagestarif (Beispiel)";
      document.getElementById("preis").textContent = `${preis.toFixed(2)} €`;

      const box = document.getElementById("ergebnis");
      box?.removeAttribute("hidden");
      box?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // === Anfrage-Form: WhatsApp ===
  const anfrageForm = document.getElementById("anfrage-form");
  if (anfrageForm) {
    anfrageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const start = document.getElementById("startadresse").value || "";
      const ziel = document.getElementById("zieladresse").value || "";
      const datum = document.getElementById("fahrt-datum").value || "";
      const uhrzeit = document.getElementById("fahrt-uhrzeit").value || "";

      if (!start.trim() || !ziel.trim() || !datum || !uhrzeit) {
        alert("Bitte alle Felder ausfüllen.");
        return;
      }

      const [y, m, d] = datum.split("-");
      const datumFormatiert = `${d}.${m}.${y}`;

      const nachricht = `📩 *Taxi Anfrage*\n🚕 Start: ${start.trim()}\n🎯 Ziel: ${ziel.trim()}\n📅 Datum: ${datumFormatiert}\n⏰ Uhrzeit: ${uhrzeit}`;
      const telefonnummer = "4917684229016"; // Ihre WhatsApp-Telefonnummer
      const url = `https://wa.me/${telefonnummer}?text=${encodeURIComponent(nachricht)}`;

      window.open(url, "_blank");
    });
  }
});
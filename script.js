document.addEventListener("DOMContentLoaded", () => {
  // --- Sticky Header beim Scrollen ---
  const header = document.querySelector(".site-header");
  const heroSection = document.querySelector(".hero");

  if (header && heroSection) {
    const updateHeroPadding = () => {
      const headerHeight = header.offsetHeight;
      heroSection.style.paddingTop = `${headerHeight + 20}px`;
    };
    updateHeroPadding();
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
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
    setTimeout(() => {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  });

  // --- Sanftes Scrollen für alle anderen Anker-Links (Desktop, Hero-Buttons etc.) ---
  document.addEventListener('click', (e) => {
    if (e.target.closest('#main-nav')) return;
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    const targetElement = document.querySelector(href);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // --- Hero Animation beim Laden der Seite ---
  const animatedHeroElements = document.querySelectorAll(".reveal-text");
  const heroStripes = document.querySelector(".hero-stripes");
  animatedHeroElements.forEach((el, index) => {
    el.style.animationDelay = `${0.2 + index * 0.2}s`;
    el.classList.add("animate");
  });
  if (heroStripes) {
    setTimeout(() => {
      heroStripes.classList.add("animate");
    }, 400);
  }

  // --- Service Cards: Klick scrollt zu Anfrage ---
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      const anfrage = document.getElementById("anfrage");
      if (anfrage) anfrage.scrollIntoView({ behavior: "smooth", block: "start" });
      toggleNav(false);
    });
  });

  // --- Scroll-Animation für Service-Karten und andere Sektionen (Fade-in) ---
  const animatedSections = document.querySelectorAll(".fade-in, .service-card");
  if ("IntersectionObserver" in window && animatedSections.length) {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    animatedSections.forEach((el) => sectionObserver.observe(el));
  } else {
    animatedSections.forEach((el) => el.classList.add("visible"));
  }

  // === GOOGLE PLACES & DIRECTIONS LOGIK (NEU & KOMBINIERT) ===
  function initMap() {
    // Felder für das Anfrageformular
    const anfrageStartInput = document.getElementById("startadresse");
    const anfrageZielInput = document.getElementById("zieladresse");
    
    // NEUE Felder für den Preisrechner
    const rechnerStartInput = document.getElementById("start-adresse-rechner");
    const rechnerZielInput = document.getElementById("ziel-adresse-rechner");

    const options = {
      componentRestrictions: { country: "de" }, // Beschränkt die Suche auf Deutschland
      fields: ["name", "geometry"],
    };

    // Autocomplete für Anfrageformular aktivieren
    if (anfrageStartInput) new google.maps.places.Autocomplete(anfrageStartInput, options);
    if (anfrageZielInput) new google.maps.places.Autocomplete(anfrageZielInput, options);
    
    // Autocomplete für Preisrechner aktivieren
    if (rechnerStartInput) new google.maps.places.Autocomplete(rechnerStartInput, options);
    if (rechnerZielInput) new google.maps.places.Autocomplete(rechnerZielInput, options);
  }
  // Macht die initMap Funktion global verfügbar
  window.initMap = initMap;

  // === Preisrechner (NEU mit Google Directions API) ===
  const form = document.getElementById("taxi-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const startAdresse = document.getElementById("start-adresse-rechner").value;
      const zielAdresse = document.getElementById("ziel-adresse-rechner").value;
      const uhrzeit = document.getElementById("uhrzeit").value;

      if (!startAdresse || !zielAdresse || !uhrzeit) {
        alert("Bitte Start, Ziel und Uhrzeit angeben.");
        return;
      }

      const directionsService = new google.maps.DirectionsService();
      directionsService.route({
        origin: startAdresse,
        destination: zielAdresse,
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status === 'OK') {
          const route = response.routes[0].legs[0];
          const distanceInMeters = route.distance.value;
          const km = distanceInMeters / 1000;

          const grundpreis = 4.20;
          const kmPreisTag = 2.50;
          const kmPreisNacht = 2.90;

          const [hh] = uhrzeit.split(":").map((n) => parseInt(n, 10));
          const nacht = hh >= 22 || hh < 6;

          const preis = grundpreis + km * (nacht ? kmPreisNacht : kmPreisTag);

          document.getElementById("distanz").textContent = `${km.toFixed(1)} km (${route.duration.text})`;
          document.getElementById("tarif").textContent = nacht ? "Nacht-/Feiertagstarif" : "Tagestarif";
          document.getElementById("preis").textContent = `${preis.toFixed(2)} €`;

          const box = document.getElementById("ergebnis");
          box?.removeAttribute("hidden");
          box?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          alert("Die Route konnte nicht berechnet werden. Bitte Adressen überprüfen. Fehler: " + status);
        }
      });
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
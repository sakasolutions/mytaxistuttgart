document.addEventListener("DOMContentLoaded", () => {
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
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 150);
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

  // --- Service Cards: Klick scrollt zu Anfrage ---
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      const anfrage = document.getElementById("anfrage");
      if (anfrage) anfrage.scrollIntoView({ behavior: "smooth", block: "start" });
      toggleNav(false);
    });
  });

  // --- Scroll-Animation für Service-Karten ---
  const serviceCards = document.querySelectorAll(".service-card");
  if ("IntersectionObserver" in window && serviceCards.length) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.15 });
    serviceCards.forEach((c) => cardObserver.observe(c));
  } else {
    serviceCards.forEach((c) => c.classList.add("visible"));
  }

  // === Preisrechner ===
  const form = document.getElementById("taxi-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const km = parseFloat(document.getElementById("kilometer").value);
      const uhrzeit = document.getElementById("uhrzeit").value;
      if (isNaN(km) || km <= 0 || !uhrzeit) { alert("Bitte Kilometerzahl und Uhrzeit korrekt eingeben."); return; }
      const grundpreis = 4.2, kmPreisTag = 2.5, kmPreisNacht = 2.9;
      const [hh] = uhrzeit.split(":").map((n) => parseInt(n, 10));
      const nacht = hh >= 22 || hh < 6;
      const preis = grundpreis + km * (nacht ? kmPreisNacht : kmPreisTag);
      document.getElementById("distanz").textContent = `${km.toFixed(1)} km`;
      document.getElementById("tarif").textContent = nacht ? "Nacht-/Feiertagstarif (Beispiel)" : "Tagestarif (Beispiel)";
      document.getElementById("preis").textContent = `${preis.toFixed(2)} €`;
      const box = document.getElementById("ergebnis");
      box?.removeAttribute("hidden");
      box?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      if (!start.trim() || !ziel.trim() || !datum || !uhrzeit) { alert("Bitte alle Felder ausfüllen."); return; }
      const [y, m, d] = datum.split("-");
      const datumFormatiert = `${d}.${m}.${y}`;
      const nachricht = `📩 *Taxi Anfrage*\n🚕 Start: ${start.trim()}\n🎯 Ziel: ${ziel.trim()}\n📅 Datum: ${datumFormatiert}\n⏰ Uhrzeit: ${uhrzeit}`;
      const telefonnummer = "4917684229016";
      const url = `https://wa.me/${telefonnummer}?text=${encodeURIComponent(nachricht)}`;
      window.open(url, "_blank");
    });
  }
});
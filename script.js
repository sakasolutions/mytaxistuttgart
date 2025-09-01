// WICHTIG: Mobile Navigation (Optik/Funktion) bleibt erhalten.
// Verbesserungen: Links korrekt verknüpft, sanftes Scrollen, Menü schließt bei Klick.

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger-menu");
  const overlay = document.getElementById("nav-overlay");
  const nav = document.getElementById("main-nav");
  const body = document.body;

  // --- Off-Canvas öffnen/schließen ---
  function toggleNav(force) {
    const willOpen = typeof force === "boolean" ? force : !body.classList.contains("nav-open");
    body.classList.toggle("nav-open", willOpen);
    overlay.hidden = !willOpen;
    burger.setAttribute("aria-expanded", String(willOpen));
  }

  burger?.addEventListener("click", () => toggleNav());
  overlay?.addEventListener("click", () => toggleNav(false));

  // --- Menü schließt bei Klick auf einen Nav-Link (mobil) ---
  nav?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    // Nur In-Page-Anker
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) toggleNav(false);
  });

  // --- Sanftes Scrollen mit Fokus-Korrektur ---
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const targetId = a.getAttribute("href").slice(1);
    if (!targetId) return;

    const el = document.getElementById(targetId);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Fokussierbar machen für Barrierefreiheit
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  });

  // --- Service Cards: kleine UX – Klick scrollt zu Anfrage ---
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      const anfrage = document.getElementById("anfrage");
      if (anfrage) {
        anfrage.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Menü sicherheitshalber schließen
      toggleNav(false);
    });
  });

  // --- Scroll-Animation für Service-Karten ---
  const serviceCards = document.querySelectorAll(".service-card");
  if ("IntersectionObserver" in window && serviceCards.length) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    serviceCards.forEach((c) => cardObserver.observe(c));
  } else {
    serviceCards.forEach((c) => c.classList.add("visible"));
  }

  // === Preisrechner (vereinfachtes Beispiel mit Stuttgarter Tariflogik Näherung) ===
  const form = document.getElementById("taxi-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const kmInput = document.getElementById("kilometer");
      const timeInput = document.getElementById("uhrzeit");
      const km = parseFloat(kmInput.value);
      const uhrzeit = timeInput.value;

      if (Number.isNaN(km) || km <= 0 || !uhrzeit) {
        alert("Bitte Kilometerzahl und Uhrzeit korrekt eingeben.");
        return;
      }

      // Beispielhafte Tariflogik (Platzhalter!):
      // Grundpreis + km-Preis, nachts/Feiertag Aufschlag.
      const grundpreis = 4.2;         // €
      const kmPreisTag = 2.5;         // €/km
      const kmPreisNacht = 2.9;       // €/km
      const [hh] = uhrzeit.split(":").map((n) => parseInt(n, 10));
      const nacht = (hh >= 22 || hh < 6);
      const tarifName = nacht ? "Nacht-/Feiertagstarif (Beispiel)" : "Tagestarif (Beispiel)";
      const preis = grundpreis + km * (nacht ? kmPreisNacht : kmPreisTag);

      // Ausgabe
      document.getElementById("distanz").textContent = `${km.toFixed(1)} km`;
      document.getElementById("tarif").textContent = tarifName;
      document.getElementById("preis").textContent = `${preis.toFixed(2)} €`;
      const box = document.getElementById("ergebnis");
      box?.removeAttribute("hidden");
      box?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // === Anfrage-Form: öffnet WhatsApp mit vorgefüllter Nachricht ===
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

      // Datum hübsch formatiert (YYYY-MM-DD -> DD.MM.YYYY)
      const [y, m, d] = datum.split("-");
      const datumFormatiert = `${d}.${m}.${y}`;

      const nachricht =
        `📩 *Taxi Anfrage*\n` +
        `🚕 Start: ${start.trim()}\n` +
        `🎯 Ziel: ${ziel.trim()}\n` +
        `📅 Datum: ${datumFormatiert}\n` +
        `⏰ Uhrzeit: ${uhrzeit}`;

      const telefonnummer = "4917684229016"; // ohne + und führende 0, für WhatsApp
      const url = `https://wa.me/${telefonnummer}?text=${encodeURIComponent(nachricht)}`;
      window.open(url, "_blank");
    });
  }
});



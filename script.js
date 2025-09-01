document.addEventListener("DOMContentLoaded", function () {
  const burger = document.getElementById("burger-menu");
  const overlay = document.getElementById("nav-overlay");
  const body = document.body;

  // Öffnet/Schließt das Menü
  function toggleNav() {
    const isOpen = body.classList.toggle("nav-open");
    overlay.hidden = !isOpen;
    burger.setAttribute("aria-expanded", isOpen);
  }

  burger.addEventListener("click", toggleNav);
  overlay.addEventListener("click", toggleNav);

  // Schließt Menü, wenn ein Link im Menü geklickt wird (optional)
  document.querySelectorAll(".main-nav a").forEach(link => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      overlay.hidden = true;
      burger.setAttribute("aria-expanded", false);
    });
  });
});

// Scroll-Animation für Service-Karten
const serviceCards = document.querySelectorAll('.service-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

serviceCards.forEach(card => {
  cardObserver.observe(card);
});


document.getElementById("taxi-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const kmInput = document.getElementById("kilometer").value.trim();
  const distanzKm = parseFloat(kmInput);
  const uhrzeit = document.getElementById("uhrzeit").value;

  if (isNaN(distanzKm) || distanzKm <= 0 || !uhrzeit) {
    alert("Bitte geben Sie eine gültige Kilometeranzahl und Uhrzeit ein.");
    return;
  }

  const [stundenStr] = uhrzeit.split(":");
  const stunde = parseInt(stundenStr, 10);
  const isNight = stunde < 6 || stunde >= 22;
  const tarif = isNight ? "Nacht (22–6 Uhr)" : "Tag (6–22 Uhr)";

  const grundgebuehr = 4.20;
  let fahrpreis;

  if (distanzKm <= 4) {
    fahrpreis = distanzKm * 2.5;
  } else {
    fahrpreis = 4 * 2.5 + (distanzKm - 4) * 2.1;
  }

  const gesamt = (grundgebuehr + fahrpreis).toFixed(2);

  document.getElementById("distanz").textContent = distanzKm.toFixed(2) + " km";
  document.getElementById("tarif").textContent = tarif;
  document.getElementById("preis").textContent = gesamt + " €";

  document.getElementById("ergebnis").hidden = false;
});



// Helper-Funktion zur sauberen Leerzeichen-Prüfung
function isEmpty(value) {
  return !value || value.replace(/\s/g, "") === "";
}

document.getElementById("anfrage-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const start = document.getElementById("startadresse").value;
  const ziel = document.getElementById("zieladresse").value;
  const datum = document.getElementById("datum").value;
  const uhrzeit = document.getElementById("uhrzeit").value;

  // Robuste Validierung
  if (isEmpty(start) || isEmpty(ziel) || isEmpty(datum) || isEmpty(uhrzeit)) {
    alert("Bitte alle Felder korrekt ausfüllen.");
    return;
  }

  // WhatsApp-Nachricht formatieren
  const nachricht =
    `🚖 *Taxi Anfrage*\n` +
    `📍 Start: ${start.trim()}\n` +
    `📍 Ziel: ${ziel.trim()}\n` +
    `📅 Datum: ${datum}\n` +
    `⏰ Uhrzeit: ${uhrzeit}`;

  // WhatsApp Zielnummer (DE ohne + oder 0)
  const telefonnummer = "4915128500947";
  const url = `https://wa.me/${telefonnummer}?text=${encodeURIComponent(nachricht)}`;

  // Weiterleitung zu WhatsApp
  window.open(url, "_blank");
});

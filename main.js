function sendeAnfrage(event) {
    event.preventDefault();
  
    const start = document.getElementById("startadresse").value.trim();
    const ziel = document.getElementById("zieladresse").value.trim();
    const datum = document.getElementById("datum").value;
    const uhrzeit = document.getElementById("uhrzeit").value;
    const versand = document.querySelector('input[name="versand"]:checked').value;
  
    const text = `Anfrage für Taxi-Fahrt:\nStart: ${start}\nZiel: ${ziel}\nDatum: ${datum}\nUhrzeit: ${uhrzeit}`;
  
    if (versand === "whatsapp") {
      const whatsappLink = `https://wa.me/4917684229016?text=${encodeURIComponent(text)}`;
      window.open(whatsappLink, "_blank");
    } else {
      const mailtoLink = `mailto:taxi.info@mail.de?subject=Taxi-Anfrage&body=${encodeURIComponent(text)}`;
      window.open(mailtoLink, "_blank");
    }
  
    document.getElementById("ausgabe").innerText = "Anfrage wurde vorbereitet. Bitte Nachricht abschicken.";
    return false;
  }


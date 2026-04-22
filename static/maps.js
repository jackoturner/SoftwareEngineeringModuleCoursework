async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (res.redirected && res.url.includes("/login")) {
    window.location.href = res.url;
    return null;
  }
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  if (!contentType.includes("application/json")) {
    throw new Error(`Expected JSON from ${url}, got ${contentType || "unknown"}`);
  }
  return res.json();
}

fetchJson("/api/pubs")
  .then((data) => {
    if (!data) return;
    initMap(data);
  })
  .catch((err) => console.error("Error loading map pubs:", err));

function initMap(pubs) {
  const map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const beerSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="140" viewBox="0 0 120 140" fill="none">
    <!-- Glass body -->
    <path d="M25 35 L25 115 C25 125 30 130 45 130 L75 130 C90 130 95 125 95 115 L95 35 L25 35 Z" 
            fill="#FFCC00" stroke="#2C2C2C" stroke-width="8" stroke-linejoin="round"/>
    
    <!-- Bottom of glass -->
    <rect x="25" y="122" width="70" height="8" rx="4" fill="#2C2C2C"/>
    
    <!-- Vertical lines on glass (highlight/reflection) -->
    <path d="M38 42 L38 118" stroke="#2C2C2C" stroke-width="6" stroke-linecap="round"/>
    <path d="M52 42 L52 118" stroke="#2C2C2C" stroke-width="6" stroke-linecap="round"/>
    <path d="M66 42 L66 118" stroke="#2C2C2C" stroke-width="6" stroke-linecap="round"/>
    <path d="M80 42 L80 118" stroke="#2C2C2C" stroke-width="6" stroke-linecap="round"/>
    
    <!-- Foam / Head (cloud shape) -->
    <path d="M22 38 
            Q28 22 40 20 
            Q48 12 60 18 
            Q72 12 82 25 
            Q90 32 95 38 
            L22 38 Z" 
            fill="#FFFFFF" stroke="#2C2C2C" stroke-width="8" stroke-linejoin="round"/>
    
    <!-- Handle -->
    <path d="M95 55 Q110 55 115 70 Q115 85 105 95 Q95 100 95 95" 
            fill="none" stroke="#2C2C2C" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
    
    <!-- Inner handle highlight (for 3D look) -->
    <path d="M100 62 Q108 63 111 73 Q111 82 104 88" 
            fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round" opacity="0.6"/>
    </svg>`;

  const beerIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(beerSVG),
    iconSize:     [26, 32],
    iconAnchor:   [13, 32],
    popupAnchor:  [0, -32]
  });

  // Beer-themed popup CSS
  const style = document.createElement('style');
  style.innerHTML = `
    .beer-popup .leaflet-popup-content-wrapper {
        background: transparent !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.35);
        border-radius: 12px;
        overflow: hidden;
    }

    .beer-popup .leaflet-popup-content {
        margin: 0;
        padding: 0;
        border-radius: 12px;
    }

    /* White foam top */
    .beer-popup .popup-header {
        background: #ffffff;
        color: #2c3e50;
        padding: 12px 16px;
        font-size: 18px;
        font-weight: bold;
        border-bottom: 4px solid #f4c95d;
        text-align: center;
    }

    /* Golden beer body */
    .beer-popup .popup-body {
        background: #FFCC00;
        color: #2c3e50;
        padding: 14px 16px;
        line-height: 1.6;
    }

    .beer-popup .popup-body a {
        color: #2c3e50;
        font-weight: bold;
        text-decoration: underline;
    }

    .beer-popup .popup-body a:hover {
        color: #1a252f;
    }

    .beer-popup .leaflet-popup-tip {
        background: #FFCC00;
    }
    `;
    document.head.appendChild(style);

  pubs.forEach(pub => {
    let reviewHTML = `<em>No reviews yet</em>`;

    if (pub.comment) {
    reviewHTML = `
        <strong>Latest Review:</strong><br>
        Rating: ${pub.rating}/5<br>
        ${pub.ai_pour_score ? `AI Score: ${pub.ai_pour_score}<br>` : ""}
        "${pub.comment}"
    `;
    }

    const popupHTML = `
    <div class="beer-popup">
        <div class="popup-header">
        ${pub.name}
        </div>
        <div class="popup-body">
        ${pub.address}, ${pub.postcode}<br><br>

        ${reviewHTML}<br><br>

        <a href="/pubs/${pub.id}">View Pub Details →</a>
        </div>
    </div>
    `;

    L.marker([pub.latitude, pub.longitude], { 
      icon: beerIcon 
    })
      .addTo(map)
      .bindPopup(popupHTML, {
        className: 'beer-popup',    
        closeButton: true,
        maxWidth: 280
      });
  });
}

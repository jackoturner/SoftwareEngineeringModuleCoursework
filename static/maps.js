fetch("/api/pubs")
  .then(res => res.json())
  .then(data => {
    initMap(data);
  });

function initMap(pubs) {
  const map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  pubs.forEach(pub => {
    const marker = L.marker([pub.latitude, pub.longitude]).addTo(map);

    marker.bindPopup(`
      <strong>${pub.name}</strong><br>
      ${pub.address}<br>
      <a href="/pubs/${pub.id}">View Pub</a>
    `);
  });
}
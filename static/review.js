document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("reviewModal");
  const openBtn = document.getElementById("addReviewBtn");
  const closeBtn = document.querySelector(".close-btn");

  const pubSelect = document.getElementById("pubSelect");
  const beerSelect = document.getElementById("beerSelect");

  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("ratingInput");

  if (!modal || !openBtn) {
    console.log("Modal or button not found");
    return;
  }

  // Open modal
  openBtn.addEventListener("click", () => {
    modal.classList.add("show");
    loadPubs();
  });

  // Close modal
  closeBtn.onclick = () => modal.classList.remove("show");

  window.onclick = e => {
    if (e.target === modal) modal.classList.remove("show");
  };

  // Load pubs
  function loadPubs() {
    fetch("/api/pubs")
      .then(res => res.json())
      .then(data => {
        pubSelect.innerHTML = `<option value="">-- Select Pub --</option>`;
        data.forEach(pub => {
          pubSelect.innerHTML += `<option value="${pub.id}">${pub.name}</option>`;
        });
      })
      .catch(err => console.error("Error loading pubs:", err));
  }

  // Load beers when pub selected
  pubSelect.addEventListener("change", () => {
    const pubId = pubSelect.value;

    beerSelect.disabled = true;

    fetch(`/api/pubs/${pubId}/beers`)
      .then(res => res.json())
      .then(data => {
        beerSelect.innerHTML = `<option value="">-- Select Beer --</option>`;
        data.forEach(beer => {
          beerSelect.innerHTML += `<option value="${beer.id}">${beer.name}</option>`;
        });
        beerSelect.disabled = false;
      })
      .catch(err => console.error("Error loading beers:", err));
  });

  // Star rating
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      const value = index + 1;
      ratingInput.value = value;

      stars.forEach((s, i) => {
        if (i < value) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });

    star.addEventListener("mouseover", () => {
      stars.forEach((s, i) => {
        s.style.color = i <= index ? "gold" : "lightgray";
      });
    });

    star.addEventListener("mouseout", () => {
      const current = ratingInput.value;
      stars.forEach((s, i) => {
        s.style.color = i < current ? "gold" : "lightgray";
      });
    });
  });

});
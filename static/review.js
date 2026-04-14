document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("reviewModal");
  const openBtn = document.getElementById("addReviewBtn"); // Make sure this button exists on pages where you want the modal
  const closeBtn = document.querySelector(".close-btn");
  const pubSelect = document.getElementById("pubSelect");
  const beerSelect = document.getElementById("beerSelect");
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("ratingInput");
  const reviewForm = document.getElementById("reviewForm");

  if (!modal) return;

  // Open modal
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("show");
      loadPubs();
    });
  }

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

  // Load beers when pub is selected
  pubSelect.addEventListener("change", () => {
    const pubId = pubSelect.value;
    beerSelect.disabled = true;
    beerSelect.innerHTML = `<option value="">-- Select Beer --</option>`;

    if (!pubId) return;

    fetch(`/api/pubs/${pubId}/beers`)
      .then(res => res.json())
      .then(data => {
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
        s.classList.toggle("active", i < value);
      });
    });

    star.addEventListener("mouseover", () => {
      stars.forEach((s, i) => {
        s.style.color = (i <= index) ? "gold" : "lightgray";
      });
    });

    star.addEventListener("mouseout", () => {
      const current = parseInt(ratingInput.value) || 0;
      stars.forEach((s, i) => {
        s.style.color = (i < current) ? "gold" : "lightgray";
      });
    });
  });

  // Form submission
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(reviewForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.rating) {
      alert("Please select a rating");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        alert("Thank you! Your review has been submitted.");
        reviewForm.reset();
        stars.forEach(s => s.classList.remove("active"));
        modal.classList.remove("show");
        
        setTimeout(() => location.reload(), 800);
      } else {
        alert(result.error || "Failed to submit review");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. Please try again.");
    }
  });
});
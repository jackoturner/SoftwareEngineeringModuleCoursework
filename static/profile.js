document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("profileBtn");
  const dropdown = document.getElementById("profileDropdown");

  if (!btn) return;

  btn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  window.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });
});
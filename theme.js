const toggle = document.getElementById("darkToggle");
const icon = toggle?.querySelector("i");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  if (icon) {
    icon.classList.replace("fa-moon", "fa-sun");
  }
}

// Toggle theme
toggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  if (icon) {
    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);
  }

  localStorage.setItem("theme", isDark ? "dark" : "light");
});


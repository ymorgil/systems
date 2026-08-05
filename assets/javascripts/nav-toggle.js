document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "nav-expanded";

  // Crea el botón
  const btn = document.createElement("button");
  btn.id = "nav-toggle-btn";
  btn.className = "md-icon nav-toggle-btn";
  btn.title = "Expandir/colapsar todo el menú";
  btn.innerHTML = "⤢";

  // Lo insertamos en la cabecera, junto al buscador
  const header = document.querySelector(".md-header__inner");
  if (header) header.appendChild(btn);

  function setState(expanded) {
    document.querySelectorAll("input.md-nav__toggle").forEach((el) => {
      el.checked = expanded;
    });
    btn.classList.toggle("is-expanded", expanded);
    localStorage.setItem(STORAGE_KEY, expanded ? "1" : "0");
  }

  // Restaurar estado guardado al cargar la página
  const saved = localStorage.getItem(STORAGE_KEY) === "1";
  setState(saved);

  btn.addEventListener("click", () => {
    const currentlyExpanded = localStorage.getItem(STORAGE_KEY) === "1";
    setState(!currentlyExpanded);
  });
});
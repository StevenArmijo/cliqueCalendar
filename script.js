document.addEventListener("DOMContentLoaded", ()=> {
    const toggleBttn = document.querySelector(".openSidebar");
    const sidebar = document.querySelector(".leftSideBar");

    if (!toggleBttn || !sidebar) return;

    toggleBttn.addEventListener("click", () => {
        sidebar.classList.toggle("is-collapsed");
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".openSidebar");
  const appShell = document.querySelector(".appShell");

  if (!toggleBtn || !appShell) return;

  toggleBtn.addEventListener("click", () => {
    appShell.classList.toggle("is-collapsed");
  });

  // Dropdown-like nav groups
  const navGroups = document.querySelectorAll(".nav-Group");
  navGroups.forEach(btn => {
    const panel = btn.nextElementSibling;
    if (!panel || !panel.classList.contains("nav-group-items")) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.classList.toggle("is-open", !isOpen);
    });
  });
});

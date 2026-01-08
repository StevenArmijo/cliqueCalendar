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
});

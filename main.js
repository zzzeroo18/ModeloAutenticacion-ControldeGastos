document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("sgg_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.getItem("sgg_theme", next);
            localStorage.setItem("sgg_theme", next);
        });
    }
    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", () => {
            const input = document.getElementById(btn.dataset.target);
            if (input.type === "password") {
                input.type = "text";
                btn.textContent = "👁️";
            } else {
                input.type = "password";
                btn.textContent = "🔒";
            }
        });
    });
});
if (!localStorage.getItem("usuarios_sgg")) {
    const defaultUsers = [
        { nombre: "Ciro", apellido: "Rolon", nacimiento: "2008-02-18", email: "hola@sgg.com", password: "Ciro123!" }
    ];
    localStorage.setItem("usuarios_sgg", JSON.stringify(defaultUsers));
}
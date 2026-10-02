document.getElementById("rec-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("rec-msg");
    const email = document.getElementById("rec-email").value.trim();
    const newPass = document.getElementById("new-password").value;
    const confirmPass = document.getElementById("confirm-new-password").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios_sgg")) || [];
    const idx = usuarios.findIndex(u => u.email === email);

    if (idx === -1) {
        msg.style.color = "var(--error-color)";
        msg.textContent = "El email ingresado no existe en el sistema.";
        return;
    }

    if (newPass !== confirmPass) {
        msg.style.color = "var(--error-color)";
        msg.textContent = "Las nuevas contraseñas no coinciden.";
        return;
    }

    // Regla de no repetir la contraseña actual
    if (usuarios[idx].password === newPass) {
        msg.style.color = "var(--error-color)";
        msg.textContent = "La nueva contraseña no puede ser igual a la clave actual.";
        return;
    }

    // Guardar cambio
    usuarios[idx].password = newPass;
    localStorage.setItem("usuarios_sgg", JSON.stringify(usuarios));

    msg.style.color = "var(--success-color)";
    msg.textContent = "¡Contraseña actualizada con éxito! Redireccionando...";
    setTimeout(() => window.location.href = "index.html", 1500);
});
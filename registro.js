const passInput = document.getElementById("reg-password");
const confirmInput = document.getElementById("confirm-password");
const btnReg = document.getElementById("btn-reg");

const reqs = {
    len: p => p.length >= 8,
    may: p => /[A-Z]/.test(p),
    min: p => /[a-z]/.test(p),
    num: p => /[0-9]/.test(p),
    spe: p => /[\!@#\$%\^&\*\(\)_\+\-\=\[\]\{\};':"\\|,.<>\/?]/.test(p)
};
passInput.addEventListener("input", () => {
    const val = passInput.value;
    let todoOk = true;

    for (let key in reqs) {
        const item = document.getElementById(`r-${key}`);
        if (reqs[key](val)) {
            item.classList.add("valid");
            item.textContent = item.textContent.replace("❌", "✔️");
        } else {
            item.classList.remove("valid");
            item.textContent = item.textContent.replace("✔️", "❌");
            todoOk = false;
        }
    }
    btnReg.disabled = !todoOk;
});

document.getElementById("reg-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("reg-msg");
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const nacimiento = document.getElementById("nacimiento").value;
    const email = document.getElementById("reg-email").value.trim();

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    if (!nameRegex.test(nombre) || !nameRegex.test(apellido)) {
        msg.style.color = "var(--error-color)";
        msg.textContent = "El nombre y apellido no deben contener números ni caracteres especiales.";
        return;
    }
    const fechaNac = new Date(nacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    if (hoy < new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate())) edad--;

    if (edad < 14) {
        msg.style.color = "var(--error-color)";
        msg.textContent = "Debes tener al menos 14 años para registrarte.";
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        msg.style.color = "var(--error-color)";
        msg.textContent = "El correo no posee una estructura válida.";
        return;
    }
    if (passInput.value !== confirmInput.value) {
        msg.style.color = "var(--error-color)";
        msg.textContent = "Las contraseñas no coinciden.";
        return;
    }
    let usuarios = JSON.parse(localStorage.getItem("usuarios_sgg")) || [];
    if (usuarios.some(u => u.email === email)) {
        msg.style.color = "var(--error-color)";
        msg.textContent = "El correo ingresado ya se encuentra registrado.";
        return;
    }
    usuarios.push({ nombre, apellido, nacimiento, email, password: passInput.value });
    localStorage.setItem("usuarios_sgg", JSON.stringify(usuarios));

    msg.style.color = "var(--success-color)";
    msg.textContent = "¡Registro exitoso! Redireccionando al login...";
    setTimeout(() => window.location.href = "index.html", 1500);
});
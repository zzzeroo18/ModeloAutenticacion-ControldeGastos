let intentosFallidos = 0;

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = document.getElementById("btn-login");
    const msg = document.getElementById("msg");
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios_sgg")) || [];
    const usuarioValido = usuarios.find(u => u.email === email && u.password === password);

    if (usuarioValido) {
    localStorage.setItem("sgg_session", JSON.stringify({ email: usuarioValido.email, nombre: usuarioValido.nombre }));
    msg.style.color = "var(--success-color)";
    msg.textContent = "¡Bienvenido " + usuarioValido.nombre + "! Redireccionando...";
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);
    }
    else {
        intentosFallidos++;
        msg.style.color = "var(--error-color)";
        if (intentosFallidos >= 3) {
            btn.disabled = true;
            let contador = 30;
            msg.textContent = `Has superado 3 intentos fallidos. Bloqueado por ${contador}s.`;
            
            const timer = setInterval(() => {
                contador--;
                msg.textContent = `Has superado 3 intentos fallidos. Bloqueado por ${contador}s.`;
                if (contador <= 0) {
                    clearInterval(timer);
                    btn.disabled = false;
                    intentosFallidos = 0;
                    msg.textContent = "";
                }
            }, 1000);
        } else {
            msg.textContent = `Credenciales incorrectas. Intento ${intentosFallidos} de 3.`;
        }
    }
});

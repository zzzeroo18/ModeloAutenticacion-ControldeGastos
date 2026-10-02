document.addEventListener("DOMContentLoaded", () => {
    const sessionData = JSON.parse(localStorage.getItem("sgg_session"));
    if (!sessionData || !sessionData.email) {
        window.location.href = "index.html";
        return;
    }

    const userDisplay = document.getElementById("user-display");
    if (userDisplay) {
        userDisplay.textContent = `Usuario: ${sessionData.nombre} (${sessionData.email})`;
    }

    document.getElementById("btn-logout").addEventListener("click", () => {
        localStorage.removeItem("sgg_session");
        window.location.href = "index.html";
    });

    const gastoForm = document.getElementById("gasto-form");
    const gastoIdInput = document.getElementById("gasto-id");
    const montoInput = document.getElementById("monto");
    const fechaInput = document.getElementById("fecha");
    const categoriaSelect = document.getElementById("categoria");
    const descripcionInput = document.getElementById("descripcion");
    const msg = document.getElementById("gasto-msg");
    const btnCancelarEdit = document.getElementById("btn-cancelar-edit");
    const formTitle = document.getElementById("form-title");

    const deleteModal = document.getElementById("delete-modal");
    const btnConfirmDelete = document.getElementById("btn-confirm-delete");
    const btnCancelDelete = document.getElementById("btn-cancel-delete");
    let itemToDeleteId = null;

    if (!localStorage.getItem("gastos_sgg")) {
        localStorage.setItem("gastos_sgg", JSON.stringify([]));
    }


    renderGastos();

   
    gastoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const monto = parseFloat(montoInput.value);
        const fecha = fechaInput.value;
        const categoria = categoriaSelect.value;
        const descripcion = descripcionInput.value.trim();
        const editId = gastoIdInput.value;

        // Regla de negocio: Monto no negativo ni cero
        if (isNaN(monto) || monto <= 0) {
            msg.style.color = "var(--error-color)";
            msg.textContent = "El monto debe ser un número mayor a cero.";
            return;
        }

        let gastos = JSON.parse(localStorage.getItem("gastos_sgg")) || [];

        if (editId) {
            // RF-07: Edición (Update)
            const index = gastos.findIndex(g => g.id == editId && g.email_usuario === sessionData.email);
            if (index !== -1) {
                gastos[index].monto = monto;
                gastos[index].fecha = fecha;
                gastos[index].categoria = categoria;
                gastos[index].descripcion = descripcion;
                msg.style.color = "var(--success-color)";
                msg.textContent = "Gasto actualizado correctamente.";
            }
        } else {
            const nuevoGasto = {
                id: Date.now(),
                email_usuario: sessionData.email, 
                monto: monto,
                fecha: fecha,
                categoria: categoria,
                descripcion: descripcion,
                estado_activo: true 
            };
            gastos.push(nuevoGasto);
            msg.style.color = "var(--success-color)";
            msg.textContent = "Gasto cargado exitosamente.";
        }

        localStorage.setItem("gastos_sgg", JSON.stringify(gastos));
        resetForm();
        renderGastos();

        setTimeout(() => { msg.textContent = ""; }, 3000);
    });

    function renderGastos() {
        const gastos = JSON.parse(localStorage.getItem("gastos_sgg")) || [];
        const tablaBody = document.getElementById("tabla-gastos-body");
        const totalDisplay = document.getElementById("total-monto");

        tablaBody.innerHTML = "";

        const gastosUsuario = gastos.filter(g => g.email_usuario === sessionData.email && g.estado_activo === true);

        let total = 0;

        gastosUsuario.forEach(gasto => {
            total += gasto.monto;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${gasto.fecha}</td>
                <td>${gasto.categoria}</td>
                <td>${gasto.descripcion}</td>
                <td>$ ${gasto.monto.toFixed(2)}</td>
                <td>
                    <button class="btn-edit" data-id="${gasto.id}">Editar</button>
                    <button class="btn-delete" data-id="${gasto.id}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(tr);
        });

        totalDisplay.textContent = `$ ${total.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Asignar eventos a los botones de la tabla
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => prepararEdicion(btn.dataset.id));
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", () => abrirModalEliminar(btn.dataset.id));
        });
    }

    function prepararEdicion(id) {
        const gastos = JSON.parse(localStorage.getItem("gastos_sgg")) || [];
        const gasto = gastos.find(g => g.id == id && g.email_usuario === sessionData.email);

        if (gasto) {
            gastoIdInput.value = gasto.id;
            montoInput.value = gasto.monto;
            fechaInput.value = gasto.fecha;
            categoriaSelect.value = gasto.categoria;
            descripcionInput.value = gasto.descripcion;

            formTitle.textContent = "Editar Gasto";
            btnCancelarEdit.style.display = "inline-block";
        }
    }

    btnCancelarEdit.addEventListener("click", resetForm);

    function resetForm() {
        gastoForm.reset();
        gastoIdInput.value = "";
        formTitle.textContent = "Cargar Nuevo Gasto";
        btnCancelarEdit.style.display = "none";
    }

    function abrirModalEliminar(id) {
        itemToDeleteId = id;
        deleteModal.showModal();
    }

    btnCancelDelete.addEventListener("click", () => {
        deleteModal.close();
        itemToDeleteId = null;
    });

    btnConfirmDelete.addEventListener("click", () => {
        if (itemToDeleteId) {
            let gastos = JSON.parse(localStorage.getItem("gastos_sgg")) || [];
            const index = gastos.findIndex(g => g.id == itemToDeleteId && g.email_usuario === sessionData.email);

            if (index !== -1) {
                gastos[index].estado_activo = false;
                localStorage.setItem("gastos_sgg", JSON.stringify(gastos));
                renderGastos();
            }
        }
        deleteModal.close();
        itemToDeleteId = null;
    });
});
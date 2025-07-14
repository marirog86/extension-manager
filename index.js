const seccionCatalogo = document.querySelector(".catalogo");
const botonActive = document.querySelector(".btn-active");
const botonInactive = document.querySelector(".btn-inactive");
const botonAll = document.querySelector(".btn-all");
const botonSun = document.querySelector(".btn-sun");
const botonMoon = document.querySelector(".btn-moon");
const seccionBody = document.querySelector("body");

let catalogo = [];

// Cambiar vista claro/oscuro
botonSun.addEventListener("click", cambiarVista);
botonMoon.addEventListener("click", cambiarVista);

function cambiarVista() {
    botonSun.classList.toggle('ocultar');
    botonMoon.classList.toggle('ocultar');
    seccionBody.classList.toggle("dark");
}

// Cargar el JSON
fetch("./data.json")
    .then(res => res.json())
    .then(datos => {
        catalogo = datos;
        mostrarCatalogo(catalogo);
    });

// Mostrar extensiones en el DOM
function mostrarCatalogo(catalogoFiltrado) {
    seccionCatalogo.innerHTML = '';

    catalogoFiltrado.forEach((extension, index) => {
        const divExtension = document.createElement("div");
        divExtension.className = "catalogo-item";
        divExtension.innerHTML = `
        <div class="container-image">
        <img src="${extension.logo}" alt="">
        <div class="container-description">
        <h3>${extension.name}</h3>
        <p>${extension.description}</p>
        </div>
        </div>
        <div class="container-borrar">
        <button data-id="${extension.id}">Remove</button>
        <label class="switch">
            <input type="checkbox" ${extension.isActive ? "checked" : ""} data-index="${index}">
            <span class="slider"></span>
        </label>
        </div>
    `;

        // Switch de estado activo/inactivo
        const checkbox = divExtension.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", (e) => {
            const idx = e.target.dataset.index;
            catalogo[idx].isActive = e.target.checked;
        });

        // Botón eliminar
        const botonEliminar = divExtension.querySelector("button");
        botonEliminar.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            const index = catalogo.findIndex(ext => ext.id === id);
            if (index !== -1) {
                catalogo.splice(index, 1);
                mostrarCatalogo(catalogo); // Volver a mostrar todo (o lo actual)
            }
        });

        seccionCatalogo.append(divExtension);
    });
}

// Botones de filtro
const botones = document.querySelectorAll(".boton");

botonAll.addEventListener("click", () => {
    mostrarCatalogo(catalogo);
    marcarBotonActivo(botonAll);
});

botonActive.addEventListener("click", () => {
    const activos = catalogo.filter(ext => ext.isActive);
    mostrarCatalogo(activos);
    marcarBotonActivo(botonActive);
});

botonInactive.addEventListener("click", () => {
    const inactivos = catalogo.filter(ext => !ext.isActive);
    mostrarCatalogo(inactivos);
    marcarBotonActivo(botonInactive);
});

function marcarBotonActivo(botonSeleccionado) {
    botones.forEach(boton => boton.classList.remove("activo"));
    botonSeleccionado.classList.add("activo");
}

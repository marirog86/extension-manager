const seccionAll = document.querySelector(".catalogo-all");
const seccionActive = document.querySelector(".catalogo-active");
const seccionInactive = document.querySelector(".catalogo-inactive");
const botonActive = document.querySelector(".btn-active");
const botonInactive = document.querySelector(".btn-inactive");
const botonAll = document.querySelector(".btn-all");
const botonSun=document.querySelector(".btn-sun");
const botonMoon=document.querySelector(".btn-moon");
const seccionBody=document.querySelector("body");

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
    .then((respuesta) => respuesta.json())
    .then((datos) => {
        catalogo = datos;
        mostrarCatalogo(catalogo, seccionAll);
    });

// Función para mostrar extensiones en una sección
function mostrarCatalogo(catalogoFiltrado, seccion) {
    seccion.innerHTML = '';

    catalogoFiltrado.forEach((extension, index) => {
        const divExtension = document.createElement("div");
        divExtension.className = `catalogo-item`;
        divExtension.innerHTML = `
        <img src=${extension.logo} alt="">
        <h3>${extension.name}</h3>
        <p>${extension.description}</p>
        <button data-id="${extension.id}">Remove</button>
        <label class="switch">
            <input type="checkbox" ${extension.isActive ? "checked" : ""} data-index="${index}">
            <span class="slider"></span>
        </label>
    `;

        // Escuchamos el cambio del switch
        const checkbox = divExtension.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", (e) => {
            const idx = e.target.dataset.index;
            catalogo[idx].isActive = e.target.checked;
        });

        //escuchamos el boton eliminar
        const botonEliminar = divExtension.querySelector("button");
        botonEliminar.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            const index = catalogo.findIndex(ext => ext.id === id);
            if (index !== -1) {
                catalogo.splice(index, 1);
                mostrarCatalogo(catalogo, seccion);
            }
    });
        seccion.append(divExtension);
    });
}

// Mostrar todo
botonAll.addEventListener("click", borrarFiltro);

// Filtrar por activo
botonActive.addEventListener("click", () => {
    filtrarExtensiones(seccionActive, true);
});

// Filtrar por inactivo
botonInactive.addEventListener("click", () => {
    filtrarExtensiones(seccionInactive, false);
});

// Filtrar extensiones
function filtrarExtensiones(seccion, estadoActivo) {
    seccionAll.classList.add("ocultar");
    seccionActive.classList.add("ocultar");
    seccionInactive.classList.add("ocultar");

    const catalogoFiltrado = catalogo.filter(ext => ext.isActive === estadoActivo);
    mostrarCatalogo(catalogoFiltrado, seccion);
    seccion.classList.remove("ocultar");
}

// Mostrar todo nuevamente
function borrarFiltro() {
    seccionAll.classList.remove("ocultar");
    seccionActive.classList.add("ocultar");
    seccionInactive.classList.add("ocultar");
}

const botones = document.querySelectorAll(".boton");

botonAll.addEventListener("click", () => {
  borrarFiltro();
  marcarBotonActivo(botonAll);
});

botonActive.addEventListener("click", () => {
  filtrarExtensiones(seccionActive, true);
  marcarBotonActivo(botonActive);
});

botonInactive.addEventListener("click", () => {
  filtrarExtensiones(seccionInactive, false);
  marcarBotonActivo(botonInactive);
});

function marcarBotonActivo(botonSeleccionado) {
  botones.forEach(boton => boton.classList.remove("activo"));
  botonSeleccionado.classList.add("activo");
}
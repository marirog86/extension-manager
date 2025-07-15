const seccionCatalogo = document.querySelector(".catalogo");
const botonActive = document.querySelector(".btn-active");
const botonInactive = document.querySelector(".btn-inactive");
const botonAll = document.querySelector(".btn-all");
const botonSun = document.querySelector(".btn-sun");
const botonMoon = document.querySelector(".btn-moon");
const seccionBody = document.querySelector("body");

let catalogo = [];
let filtroActual = "all";

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
        refrescarCatalogoFiltrado(); // muestra según filtroActual = "all"
    })
    .catch(err => {
        console.error("Error al cargar el JSON:", err);
        seccionCatalogo.innerHTML = "<p>Error al cargar los datos.</p>";
    });

// Refresca la lista según el filtro actual
function refrescarCatalogoFiltrado() {
    let datosAMostrar;
    switch (filtroActual) {
        case "active":
            datosAMostrar = catalogo.filter(ext => ext.isActive);
            marcarBotonActivo(botonActive);
            break;
        case "inactive":
            datosAMostrar = catalogo.filter(ext => !ext.isActive);
            marcarBotonActivo(botonInactive);
            break;
        default:
            datosAMostrar = catalogo;
            marcarBotonActivo(botonAll);
    }
    mostrarCatalogo(datosAMostrar);
}

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
                <input type="checkbox" ${extension.isActive ? "checked" : ""} data-id="${extension.id}">
                <span class="slider"></span>
            </label>
        </div>
    `;

        // Switch de estado activo/inactivo
        const checkbox = divExtension.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", (e) => {
            const id = e.target.dataset.id;
            const ext = catalogo.find(ext => ext.id === id);
            if (ext) {
                ext.isActive = e.target.checked;
                refrescarCatalogoFiltrado();
            }
        });

        // Botón eliminar
        const botonEliminar = divExtension.querySelector("button");
        botonEliminar.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            const index = catalogo.findIndex(ext => ext.id === id);
            if (index !== -1) {
                catalogo.splice(index, 1);
                refrescarCatalogoFiltrado();
            }
        });

        seccionCatalogo.append(divExtension);
    });
}

// Botones de filtro
botonAll.addEventListener("click", () => {
    filtroActual = "all";
    refrescarCatalogoFiltrado();
});

botonActive.addEventListener("click", () => {
    filtroActual = "active";
    refrescarCatalogoFiltrado();
});

botonInactive.addEventListener("click", () => {
    filtroActual = "inactive";
    refrescarCatalogoFiltrado();
});

function marcarBotonActivo(botonSeleccionado) {
    document.querySelectorAll(".boton").forEach(boton =>
        boton.classList.remove("activo")
    );
    botonSeleccionado.classList.add("activo");
}


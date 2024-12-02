// URL del servidor JSON
const API_URL = "http://localhost:3000/productos";

// Seleccionamos el contenedor donde se mostrarán los productos
const productsGrid = document.querySelector(".products-grid");

// Función para cargar los productos desde la API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL); // Hacemos una petición GET a la API
        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
        }

        const productos = await response.json(); // Convertimos la respuesta a JSON
        displayProducts(productos); // Mostramos los productos en la página
    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}

// Función para mostrar los productos en el grid
function displayProducts(productos) {
    // Limpiamos el contenedor por si ya hay contenido
    productsGrid.innerHTML = "";

    // Iteramos sobre los productos obtenidos
    productos.forEach(producto => {
        // Creamos los elementos para cada producto
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p><strong>Nombre:</strong> ${producto.nombre}</p>
            <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
        `;

        // Agregamos el producto al grid
        productsGrid.appendChild(productDiv);
    });
}

// Llamamos a la función para cargar los productos al cargar la página
fetchProducts();

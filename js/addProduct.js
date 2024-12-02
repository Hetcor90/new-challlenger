
const productForm = document.querySelector("#product-form");

// Función para obtener los productos de la API (GET)
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
}

// Función para renderizar los productos
function renderProducts(productos) {
    productsGrid.innerHTML = ''; // Limpiamos el contenedor de productos

    productos.forEach(producto => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-id", producto.id); // Usamos un data-attribute para el ID

        productCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <button class="delete-btn" data-id="${producto.id}">Eliminar</button> <!-- Botón de eliminar -->
        `;

        // Agregamos la tarjeta al contenedor de productos
        productsGrid.appendChild(productCard);
    });

    // Agregar eventos a los botones de eliminar
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", handleDeleteProduct);
    });
}

// Función para manejar la eliminación de un producto
async function handleDeleteProduct(event) {
    const productId = event.target.getAttribute("data-id"); // Obtenemos el ID del producto

    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE", // Método DELETE
        });

        if (response.ok) {
            console.log(`Producto con ID ${productId} eliminado`);
            // Después de eliminar el producto, actualizamos la lista
            fetchProducts().then(productos => renderProducts(productos));
        } else {
            console.error("No se pudo eliminar el producto");
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
    }
}

// Función para agregar un producto al servidor (POST)
async function addProduct(producto) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST', // Método POST para agregar el producto
            headers: {
                'Content-Type': 'application/json', // Enviamos datos en formato JSON
            },
            body: JSON.stringify(producto), // Enviamos el producto como un JSON
        });

        if (!response.ok) {
            throw new Error(`Error al agregar el producto: ${response.status}`);
        }

        const newProduct = await response.json(); // Obtenemos la respuesta del servidor con el nuevo producto
        console.log("Producto agregado:", newProduct);

        // Después de agregar el producto, actualizamos la lista de productos en la página
        fetchProducts().then((productos) => {
            renderProducts(productos); // Volvemos a renderizar los productos
        });

    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
}

// Función para manejar el envío del formulario
function handleFormSubmit(event) {
    event.preventDefault(); // Prevenimos la acción por defecto (recargar la página)

    // Recogemos los valores del formulario
    const productData = {
        nombre: document.querySelector("#name").value,
        precio: parseFloat(document.querySelector("#price").value),
        imagen: document.querySelector("#image").value,
    };

    // Llamamos a la función para agregar el producto al servidor
    addProduct(productData);

    // Limpiar el formulario después de enviar los datos
    productForm.reset();
}

// Agregar el evento de submit al formulario
productForm.addEventListener("submit", handleFormSubmit);

// Llamamos a fetchProducts al cargar la página para cargar los productos existentes
fetchProducts().then(productos => {
    renderProducts(productos); // Renderizamos los productos existentes
});

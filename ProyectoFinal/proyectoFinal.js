document.addEventListener('DOMContentLoaded', () => {
    // Base de datos simulada
    const db = {
        usuarios: [
            { id: 1, nombre: "comprador1", password: "1234", rol: "comprador" },
            { id: 2, nombre: "vendedor1", password: "1234", rol: "vendedor" }
        ],
        productos: [],
    };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let usuarioActivo = null;

    function mostrarSeccion(rol) {
        document.getElementById('login').classList.add('hidden');
        if (rol === "comprador") {
            document.getElementById('vendedor').classList.add('hidden');
            document.getElementById('comprador').classList.remove('hidden');
            cargarProductos();
            mostrarCarrito();
        } else if (rol === "vendedor") {
            document.getElementById('comprador').classList.add('hidden');
            document.getElementById('vendedor').classList.remove('hidden');
            cargarMisProductos();
        }
    }

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        usuarioActivo = db.usuarios.find(user => user.nombre === username && user.password === password);
        if (usuarioActivo) {
            mostrarSeccion(usuarioActivo.rol);
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });

    function agregarAlCarrito(producto) {
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }

    function mostrarCarrito() {
        const carritoDiv = document.getElementById('carrito');
        carritoDiv.innerHTML = '';
        carrito.forEach((producto, index) => {
            const item = document.createElement('div');
            item.textContent = `${producto.nombre} - $${producto.precio}`;
            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', () => {
                carrito.splice(index, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
            });
            item.appendChild(eliminarBtn);
            carritoDiv.appendChild(item);
        });
    }

    function cargarProductos() {
        const lista = document.getElementById('productos-lista');
        lista.innerHTML = '';
        db.productos.forEach(producto => {
            const item = document.createElement('div');
            item.textContent = `${producto.nombre} - $${producto.precio}`;
            const btnAgregar = document.createElement('button');
            btnAgregar.textContent = 'Agregar al Carrito';
            btnAgregar.addEventListener('click', () => agregarAlCarrito(producto));
            item.appendChild(btnAgregar);
            lista.appendChild(item);
        });
    }

    function agregarProducto(producto) {
        db.productos.push(producto);
        cargarMisProductos();
    }

    function cargarMisProductos() {
        const lista = document.getElementById('mis-productos');
        lista.innerHTML = '';
        db.productos.forEach((producto, index) => {
            const item = document.createElement('div');
            item.textContent = `${producto.nombre} - $${producto.precio}`;
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.addEventListener('click', () => {
                db.productos.splice(index, 1);
                cargarMisProductos();
            });
            item.appendChild(btnEliminar);
            lista.appendChild(item);
        });
    }

    document.getElementById('producto-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const descripcion = document.getElementById('descripcion').value;
        const stock = parseInt(document.getElementById('stock').value, 10);

        if (nombre && precio && descripcion && stock) {
            agregarProducto({ nombre, precio, descripcion, stock });
            document.getElementById('producto-form').reset();
        } else {
            alert("Por favor, complete todos los campos");
        }
    });

    document.getElementById('btn-comprador').addEventListener('click', () => mostrarSeccion("comprador"));
    document.getElementById('btn-vendedor').addEventListener('click', () => mostrarSeccion("vendedor"));
});

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    // Mostrar formulario de checkout
    document.getElementById('checkout').classList.remove('hidden');
    document.getElementById('finalizar-compra').classList.add('hidden');
}

// Función para manejar el formulario de checkout
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombreComprador = document.getElementById('nombre-comprador').value;
    const direccion = document.getElementById('direccion').value;
    const metodoPago = document.getElementById('metodo-pago').value;

    if (nombreComprador && direccion && metodoPago) {
        // Calcular total
        let total = carrito.reduce((sum, producto) => sum + producto.precio, 0);

        // Mostrar detalles de compra
        alert(`¡Compra realizada con éxito!\nTotal a pagar: $${total}\nMétodo de Pago: ${metodoPago}\nDirección de Envío: ${direccion}`);

        // Vaciar el carrito y actualizar LocalStorage
        carrito = [];
        localStorage.removeItem('carrito');
        mostrarCarrito(); // Actualizar la vista del carrito

        // Ocultar formulario de checkout y mostrar confirmación
        document.getElementById('checkout').classList.add('hidden');
        document.getElementById('confirmacion-compra').classList.remove('hidden');
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Evento para el botón "Finalizar Compra"
document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);

// Evento para el botón "Volver a Comprar"
document.getElementById('volver-a-comprar').addEventListener('click', function() {
    // Ocultar confirmación y mostrar productos disponibles
    document.getElementById('confirmacion-compra').classList.add('hidden');
    mostrarSeccion("comprador"); // Regresar a la sección de comprador
});

// Inicializar el carrito desde LocalStorage o como un arreglo vacío si no existe
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    // Mostrar formulario de checkout
    document.getElementById('checkout').classList.remove('hidden');
    document.getElementById('finalizar-compra').classList.add('hidden');
}

// Función para manejar el formulario de checkout
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombreComprador = document.getElementById('nombre-comprador').value;
    const direccion = document.getElementById('direccion').value;
    const metodoPago = document.getElementById('metodo-pago').value;

    if (nombreComprador && direccion && metodoPago) {
        // Calcular total con reduce
        let total = carrito.reduce((sum, producto) => sum + producto.precio, 0);

        // Mostrar detalles de compra
        alert(`¡Compra realizada con éxito!\nTotal a pagar: $${total}\nMétodo de Pago: ${metodoPago}\nDirección de Envío: ${direccion}`);

        // Vaciar el carrito y actualizar LocalStorage
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito(); // Actualizar la vista del carrito

        // Ocultar formulario de checkout y mostrar confirmación
        document.getElementById('checkout').classList.add('hidden');
        document.getElementById('confirmacion-compra').classList.remove('hidden');
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Evento para el botón "Finalizar Compra"
document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);

// Evento para el botón "Volver a Comprar"
document.getElementById('volver-a-comprar').addEventListener('click', function() {
    // Ocultar confirmación y mostrar productos disponibles
    document.getElementById('confirmacion-compra').classList.add('hidden');
    mostrarSeccion("comprador"); // Regresar a la sección de comprador
});

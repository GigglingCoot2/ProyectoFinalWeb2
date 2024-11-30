document.addEventListener('DOMContentLoaded', () => {
    // Base de datos simulada
    const db = {
        usuarios: [
            { id: 1, nombre: "comprador1", password: "1234", rol: "comprador" },
            { id: 2, nombre: "vendedor1", password: "1234", rol: "vendedor" }
        ],
        productos: [
            { nombre: "Calcetines", precio: 100, descripcion: "Afelpados", stock: 10 },
            { nombre: "Gorras", precio: 150, descripcion: "Nuevas", stock: 5 },
            { nombre: "Sudadera", precio: 200, descripcion: "Guchi", stock: 2 }
        ]
    };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let usuarioActivo = null;

    function mostrarSeccion(rol) {
        // Si el usuario no está logueado, pedir login
        if (!usuarioActivo) {
            document.getElementById('login').classList.remove('hidden');
            document.getElementById('comprador').classList.add('hidden');
            document.getElementById('vendedor').classList.add('hidden');
            return;
        }

        document.getElementById('login').classList.add('hidden');
        
        // Se verifican los roles y se muestran las secciones correspondientes
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

    // Función para agregar al carrito
    function agregarAlCarrito(producto) {
        if (producto.stock > 0) {
            carrito.push(producto);
            producto.stock -= 1; // Reducir el stock en la base de datos
            localStorage.setItem('carrito', JSON.stringify(carrito));
            cargarProductos(); // Actualizar los productos disponibles
            mostrarCarrito();
        } else {
            alert("No hay suficiente stock para agregar este producto al carrito.");
        }
    }

    // Función para mostrar el carrito
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
                producto.stock += 1; // Restaurar el stock cuando se elimina del carrito
                localStorage.setItem('carrito', JSON.stringify(carrito));
                cargarProductos(); // Actualizar los productos disponibles
                mostrarCarrito();
            });
            item.appendChild(eliminarBtn);
            carritoDiv.appendChild(item);
        });
    }

    // Función para cargar los productos disponibles para el comprador
    function cargarProductos() {
        const lista = document.getElementById('productos-lista');
        lista.innerHTML = '';
        db.productos.forEach(producto => {
            const item = document.createElement('div');
            item.textContent = `${producto.nombre} - $${producto.precio} - ${producto.descripcion} - Stock: ${producto.stock}`;
            const btnAgregar = document.createElement('button');
            btnAgregar.textContent = producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock';
            btnAgregar.disabled = producto.stock <= 0; // Deshabilitar si no hay stock disponible
            btnAgregar.addEventListener('click', () => agregarAlCarrito(producto));
            item.appendChild(btnAgregar);
            lista.appendChild(item);
        });
    }

    // Función para agregar un nuevo producto
    function agregarProducto(producto) {
        db.productos.push(producto);
        cargarMisProductos();
    }

    // Función para cargar los productos del vendedor
    function cargarMisProductos() {
        const lista = document.getElementById('mis-productos');
        lista.innerHTML = '';
        db.productos.forEach((producto, index) => {
            const item = document.createElement('div');
            item.textContent = `${producto.nombre} - $${producto.precio} - ${producto.descripcion} - Stock: ${producto.stock}`;
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

    // Event listeners para manejar la adición de productos
    document.getElementById('producto-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const descripcion = document.getElementById('descripcion').value;
        const stock = parseInt(document.getElementById('stock').value, 10);

        if (nombre && precio && descripcion && stock >= 0) {
            agregarProducto({ nombre, precio, descripcion, stock });
            document.getElementById('producto-form').reset();
        } else {
            alert("Por favor, complete todos los campos correctamente");
        }
    });

    // Eventos para cambiar entre comprador y vendedor
    document.getElementById('btn-comprador').addEventListener('click', () => {
        usuarioActivo = null; // Resetear el usuario activo al cambiar de rol
        mostrarSeccion(null); // Forzar a que se pida login
    });

    document.getElementById('btn-vendedor').addEventListener('click', () => {
        usuarioActivo = null; // Resetear el usuario activo al cambiar de rol
        mostrarSeccion(null); // Forzar a que se pida login
    });
    // Registro de usuarios
    document.getElementById('btn-registro').addEventListener('click', () => {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('registro').classList.remove('hidden');
    });

    document.getElementById('volver-login').addEventListener('click', () => {
        document.getElementById('registro').classList.add('hidden');
        document.getElementById('login').classList.remove('hidden');
    });

    document.getElementById('registro-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevoUsername = document.getElementById('nuevo-username').value.trim();
        const nuevoPassword = document.getElementById('nuevo-password').value.trim();
        const nuevoRol = document.getElementById('nuevo-rol').value;

        if (!nuevoUsername || !nuevoPassword || !nuevoRol) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const usuarioExistente = db.usuarios.some(user => user.nombre === nuevoUsername);
        if (usuarioExistente) {
            alert("El nombre de usuario ya está en uso. Por favor, elija otro.");
            return;
        }

        db.usuarios.push({
            id: db.usuarios.length + 1,
            nombre: nuevoUsername,
            password: nuevoPassword,
            rol: nuevoRol
        });

        alert("Usuario registrado exitosamente. Ahora puede iniciar sesión.");
        document.getElementById('registro-form').reset();
        document.getElementById('registro').classList.add('hidden');
        document.getElementById('login').classList.remove('hidden');
    });

    // Evento para finalizar la compra
    function finalizarCompra() {
        if (carrito.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
            return;
        }

        // Mostrar formulario de checkout
        document.getElementById('checkout').classList.remove('hidden');
        document.getElementById('finalizar-compra').classList.add('hidden');
    }

    // Evento para el formulario de checkout
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const nombreComprador = document.getElementById('nombre-comprador').value;
        const direccion = document.getElementById('direccion').value;
        const metodoPago = document.getElementById('metodo-pago').value;

        if (nombreComprador && direccion && metodoPago) {
            // Calcular total con reduce
            let total = carrito.reduce((sum, producto) => sum + producto.precio, 0);

            // Mostrar detalles de compra en alerta
            alert(`¡Compra realizada con éxito!\nTotal a pagar: $${total}\nMétodo de Pago: ${metodoPago}\nDirección de Envío: ${direccion}\nComprador: ${nombreComprador}`);

            // Vaciar el carrito (sin restaurar el stock)
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
        carrito = []; // Vaciar el carrito
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizar el carrito en LocalStorage
        mostrarCarrito(); // Actualizar la vista del carrito
    });
});

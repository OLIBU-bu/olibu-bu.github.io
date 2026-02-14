/* =========================================
   VARIABLES GLOBALES
========================================= */

let categoriaActual = "Todos";
let carrito = [];

/* =========================================
   GENERAR CATEGORÍAS
========================================= */

function generarCategorias() {

  const menu = document.getElementById("menu-categorias");

  const categorias = ["Todos", ...new Set(productos.map(p => p.categoria))];

  menu.innerHTML = "";

  categorias.forEach(cat => {

    menu.innerHTML += `
      <button 
        onclick="cambiarCategoria('${cat}')"
        class="${cat === categoriaActual ? 'activa' : ''}">
        ${cat}
      </button>
    `;
  });
}

/* =========================================
   CAMBIAR CATEGORÍA
========================================= */

function cambiarCategoria(cat) {
  categoriaActual = cat;
  generarCategorias();
  renderProductos();
}

/* =========================================
   OBTENER PRECIO SEGÚN CANTIDAD
========================================= */

function obtenerPrecio(producto, cantidad = 1) {

  let precio = producto.precios[0].precio;

  producto.precios.forEach(p => {
    if (cantidad >= p.min) {
      precio = p.precio;
    }
  });

  return precio;
}

/* =========================================
   MOSTRAR PRODUCTOS
========================================= */

function renderProductos() {

  const contenedor = document.getElementById("lista-productos");
  const textoBusqueda = document.getElementById("buscador").value.toLowerCase();

  contenedor.innerHTML = "";

  const filtrados = productos.filter(p => {

    const coincideCategoria =
      categoriaActual === "Todos" || p.categoria === categoriaActual;

    const coincideBusqueda =
      p.nombre.toLowerCase().includes(textoBusqueda);

    return coincideCategoria && coincideBusqueda;
  });

  filtrados.forEach(p => {

    const precioBase = obtenerPrecio(p, 1);

    contenedor.innerHTML += `
      <div class="card">
        <img src="${p.imagen}" class="producto-img" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>S/ ${precioBase.toFixed(2)}</p>
        <button onclick="agregarCarrito(${p.id})">
          Agregar al carrito
        </button>
      </div>
    `;
  });
}

/* =========================================
   FILTRO BUSCADOR
========================================= */

function filtrarProductos() {
  renderProductos();
}

/* =========================================
   AGREGAR AL CARRITO
========================================= */

function agregarCarrito(id) {

  const producto = productos.find(p => p.id === id);

  const item = carrito.find(i => i.id === id);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      cantidad: 1
    });
  }

  actualizarCarrito();

  // 🔥 ACTIVA EL CARRITO LATERAL
  document.getElementById("carrito").classList.add("activo");
}

/* =========================================
   CAMBIAR CANTIDAD
========================================= */

function cambiarCantidad(id, cambio) {

  const item = carrito.find(p => p.id === id);

  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }

  actualizarCarrito();
}

/* =========================================
   ELIMINAR PRODUCTO
========================================= */

function eliminarProducto(id) {
  carrito = carrito.filter(p => p.id !== id);
  actualizarCarrito();
}

/* =========================================
   CERRAR CARRITO
========================================= */

function cerrarCarrito() {
  document.getElementById("carrito").classList.remove("activo");
}

/* =========================================
   ACTUALIZAR CARRITO
========================================= */

function actualizarCarrito() {

  const carritoDiv = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");

  carritoDiv.innerHTML = "";

  let total = 0;

  carrito.forEach(item => {

    const producto = productos.find(p => p.id === item.id);

    const precioUnitario = obtenerPrecio(producto, item.cantidad);

    const subtotal = precioUnitario * item.cantidad;

    total += subtotal;

    carritoDiv.innerHTML += `
      <div class="item-carrito">

        <strong>${producto.nombre}</strong>

        <div style="font-size:13px; color:#666;">
          Precio unitario: S/ ${precioUnitario.toFixed(2)}
        </div>

        ${item.cantidad >= 6 ? `
          <div style="color:#2e7d32; font-size:12px;">
            ✔ Precio mayorista aplicado
          </div>
        ` : ""}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          
          <div>
            <button onclick="cambiarCantidad(${item.id}, -1)">−</button>
            <span style="margin:0 8px;">${item.cantidad}</span>
            <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
          </div>

          <div style="font-weight:600;">
            S/ ${subtotal.toFixed(2)}
          </div>

        </div>

        <button onclick="eliminarProducto(${item.id})" style="margin-top:6px;">
          Eliminar
        </button>

      </div>
    `;
  });

  totalSpan.innerText = total.toFixed(2);
}

/* =========================================
   COMPRAR POR WHATSAPP
========================================= */

function comprarWhatsApp() {

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "Hola, quiero hacer el siguiente pedido:%0A";
  let total = 0;

  carrito.forEach(item => {

    const producto = productos.find(p => p.id === item.id);

    const precioUnitario = obtenerPrecio(producto, item.cantidad);

    const subtotal = precioUnitario * item.cantidad;

    total += subtotal;

    mensaje += `- ${producto.nombre} x${item.cantidad} (S/ ${subtotal.toFixed(2)})%0A`;
  });

  mensaje += `%0ATotal: S/ ${total.toFixed(2)}`;

  window.open(`https://wa.me/51975455690?text=${mensaje}`, "_blank");
}
/* =========================================
   EFECTO NAVBAR SCROLL
========================================= */

window.addEventListener("scroll", function() {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
// BOTÓN CARRITO FLOTANTE
function toggleCarrito() {
  const carritoEl = document.getElementById('carrito');
  carritoEl.classList.toggle('activo');
}

// Actualizar contador y visibilidad
function actualizarContadorCarrito() {
  const btn = document.getElementById('btn-carrito-flotante');
  const contador = document.getElementById('contador-carrito');
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  
  contador.textContent = totalItems;
  
  if (totalItems === 0) {
    btn.classList.add('vacio');
  } else {
    btn.classList.remove('vacio');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btn-carrito-flotante').addEventListener('click', function(e) {
    e.preventDefault();
    toggleCarrito();
  });
  
  // Llamar al actualizar carrito existente
  const oldActualizarCarrito = actualizarCarrito;
  actualizarCarrito = function() {
    oldActualizarCarrito(); // Llama al original
    actualizarContadorCarrito(); // Nuevo
  };
});

/* =========================================
   INICIALIZACIÓN
========================================= */

generarCategorias();
renderProductos();


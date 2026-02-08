function obtenerPrecio(producto, cantidad = 1) {
  let precio = producto.precios[0].precio;

  producto.precios.forEach(p => {
    if (cantidad >= p.min) precio = p.precio;
  });

  return precio;
}

function renderProductos() {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";

  productos.forEach(p => {
    const precioBase = obtenerPrecio(p, 1);

    contenedor.innerHTML += `
  <div class="card">
    <img src="${p.imagen}" alt="${p.nombre}" class="producto-img">

    <h3>${p.nombre}</h3>
    <p>S/ ${precioBase}</p>

    <button onclick="agregarCarrito(${p.id})">
      Agregar al carrito
    </button>
  </div>
`;

  });
}


let carrito = [];

function agregarCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const item = carrito.find(i => i.id === id);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({
      id,
      nombre: producto.nombre,
      cantidad: 1
    });
  }

  actualizarCarrito();
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }

  actualizarCarrito();
}
function eliminarProducto(id) {
  carrito = carrito.filter(p => p.id !== id);
  actualizarCarrito();
}








function actualizarCarrito() {
  const carritoDiv = document.getElementById("carrito");
  carritoDiv.innerHTML = "";

  let total = 0;

  carrito.forEach(item => {
    const producto = productos.find(p => p.id === item.id);
    const precioUnitario = obtenerPrecio(producto, item.cantidad);
    const subtotal = precioUnitario * item.cantidad;

    total += subtotal;

    carritoDiv.innerHTML += `
      <div class="item-carrito">
        <strong>${producto.nombre}</strong><br>
        Precio unitario: S/ ${precioUnitario}<br>

        <button onclick="cambiarCantidad(${item.id}, -1)">−</button>
        ${item.cantidad}
        <button onclick="cambiarCantidad(${item.id}, 1)">+</button>

        <br>Subtotal: S/ ${subtotal.toFixed(2)}<br>

        <button onclick="eliminarProducto(${item.id})">Eliminar</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = total.toFixed(2);
}



function comprarWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "Hola, quiero hacer el siguiente pedido:%0A";

  carrito.forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad} (S/ ${(item.precio * item.cantidad).toFixed(2)})%0A`;
  });

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  mensaje += `%0ATotal: S/ ${total.toFixed(2)}`;

  window.open(`https://wa.me/51975455690?text=${mensaje}`, "_blank");
}
renderProductos();

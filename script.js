/* ================================================
   OLIBU — SCRIPT PREMIUM
   ================================================ */

/* VARIABLES GLOBALES */
let categoriaActual = 'Todos';
let carrito = [];
let totalCarrito = 0;
let productoModal = null;
let cantidadModal = 1;

function cerrarPromoBar() {
  const bar = document.getElementById('promo-top-bar');
  if (bar) {
    bar.style.maxHeight = '0';
    bar.style.padding = '0';
    bar.style.overflow = 'hidden';
    setTimeout(function() { bar.style.display = 'none'; }, 300);
  }
}

function filtrarCategoria(cat) {
  categoriaActual = cat;
  const productosSection = document.getElementById('productos');
  if (productosSection) productosSection.scrollIntoView({ behavior: 'smooth' });
  generarCategorias();
  renderProductos();
}

/* ===========================
   LOADER
=========================== */
window.addEventListener('load', function() {
  setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('oculto');
  }, 1800);
});

/* ===========================
   CURSOR PERSONALIZADO
=========================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower && window.innerWidth > 768) {
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(function() {
      follower.style.left = e.clientX + 'px';
      follower.style.top = e.clientY + 'px';
    }, 60);
  });

  document.addEventListener('mousedown', function() {
    cursor.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  document.addEventListener('mouseup', function() {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  // Efecto hover en links y botones
  document.querySelectorAll('a, button').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      follower.style.transform = 'translate(-50%,-50%) scale(1.6)';
      follower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', function() {
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.opacity = '0.6';
    });
  });
}

/* ===========================
   NAVBAR
=========================== */
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('abierto');
  });

  navLinks.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      navLinks.classList.remove('abierto');
    });
  });
}

/* ===========================
   ANIMACIÓN SCROLL (TITULO VIDEO)
=========================== */
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('activo');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.titulo-video').forEach(function(el) {
  observer.observe(el);
});

/* ===========================
   CATEGORÍAS
=========================== */
function generarCategorias() {
  const menu = document.getElementById('menu-categorias');
  if (!menu) return;
  const categorias = ['Todos', ...new Set(productos.map(function(p) { return p.categoria; }))];
  menu.innerHTML = '';
  categorias.forEach(function(cat) {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = cat === categoriaActual ? 'activa' : '';
    btn.addEventListener('click', function() { cambiarCategoria(cat); });
    menu.appendChild(btn);
  });
}

function cambiarCategoria(cat) {
  categoriaActual = cat;
  generarCategorias();
  renderProductos();
}

/* ===========================
   PRECIO SEGÚN CANTIDAD
=========================== */
function obtenerPrecio(producto, cantidad) {
  cantidad = cantidad || 1;
  let precio = producto.precios[0].precio;
  producto.precios.forEach(function(p) {
    if (cantidad >= p.min) precio = p.precio;
  });
  return parseFloat(precio);
}

/* ===========================
   RENDER PRODUCTOS
=========================== */
function renderProductos() {
  const contenedor = document.getElementById('lista-productos');
  const infoEl = document.getElementById('resultados-info');
  if (!contenedor) return;

  const textoBusqueda = (document.getElementById('buscador') ? document.getElementById('buscador').value : '').toLowerCase();
  contenedor.innerHTML = '';

  const filtrados = productos.filter(function(p) {
    const coincideCategoria = categoriaActual === 'Todos' || p.categoria === categoriaActual;
    const coincideBusqueda = p.nombre.toLowerCase().includes(textoBusqueda);
    return coincideCategoria && coincideBusqueda;
  });

  if (infoEl) {
    infoEl.textContent = filtrados.length + ' producto' + (filtrados.length !== 1 ? 's' : '') + ' encontrado' + (filtrados.length !== 1 ? 's' : '');
  }

  filtrados.forEach(function(p) {
    const precioBase = obtenerPrecio(p, 1);
    const precioMay = p.precios.length > 1 ? p.precios[p.precios.length - 1] : null;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML =
      '<div class="product-img-wrap">' +
        (precioMay ? '<span class="mayorista-tag">Mayorista</span>' : '') +
        '<img src="' + p.imagen + '" alt="' + p.nombre + '" loading="lazy">' +
      '</div>' +
      '<div class="product-info">' +
        '<p class="product-cat">' + p.categoria + '</p>' +
        '<p class="product-name">' + p.nombre + '</p>' +
        '<div class="product-price-row">' +
          '<span class="price-main">S/ ' + precioBase.toFixed(2) + '</span>' +
          (precioMay ? '<span class="price-may">Desde 6 und.<strong>S/ ' + precioMay.precio.toFixed(2) + '</strong></span>' : '') +
        '</div>' +
        '<button class="btn-agregar">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14"><path d="M12 5v14M5 12h14"/></svg>' +
          'Agregar al carrito' +
        '</button>' +
      '</div>';

    card.querySelector('.product-img-wrap').addEventListener('click', function() { abrirModal(p.id); });
    card.querySelector('.product-name').addEventListener('click', function() { abrirModal(p.id); });
    card.querySelector('.btn-agregar').addEventListener('click', function(e) {
      e.stopPropagation();
      agregarCarrito(p.id, 1);
    });

    contenedor.appendChild(card);
  });
}

/* ===========================
   MODAL PRODUCTO
=========================== */
function abrirModal(id) {
  const p = productos.find(function(x) { return x.id == id; });
  if (!p) return;

  productoModal = p;
  cantidadModal = 1;

  document.getElementById('modal-img').src = p.imagen;
  document.getElementById('modal-img').alt = p.nombre;
  document.getElementById('modal-nombre').textContent = p.nombre;
  document.getElementById('modal-categoria').textContent = p.categoria;
  document.getElementById('modal-qty').textContent = 1;

  // Precios
  const preciosEl = document.getElementById('modal-precios');
  let html = '';
  p.precios.forEach(function(pr, i) {
    const label = i === 0
      ? 'Precio unitario (1-' + (p.precios[1] ? p.precios[1].min - 1 : '+') + ' und.)'
      : 'Precio mayorista (desde ' + pr.min + ' und.)';
    html += '<div class="precio-linea' + (i > 0 ? ' mayorista' : '') + '">' +
      '<span>' + label + '</span>' +
      '<strong>S/ ' + pr.precio.toFixed(2) + '</strong>' +
      '</div>';
  });
  preciosEl.innerHTML = html;

  actualizarModalSubtotal();

  document.getElementById('modal-overlay').classList.add('activo');
  document.getElementById('modal-producto').classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('activo');
  document.getElementById('modal-producto').classList.remove('activo');
  document.body.style.overflow = '';
  productoModal = null;
}

function modalCambiarQty(cambio) {
  cantidadModal = Math.max(1, cantidadModal + cambio);
  document.getElementById('modal-qty').textContent = cantidadModal;
  actualizarModalSubtotal();
}

function actualizarModalSubtotal() {
  if (!productoModal) return;
  const precio = obtenerPrecio(productoModal, cantidadModal);
  const subtotal = precio * cantidadModal;
  document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
}

function modalAgregarCarrito() {
  if (!productoModal) return;
  agregarCarrito(productoModal.id, cantidadModal);
  cerrarModal();
}

/* ===========================
   CARRITO
=========================== */
function agregarCarrito(id, cantidad) {
  const producto = productos.find(function(p) { return p.id == id; });
  const item = carrito.find(function(i) { return i.id == id; });
  cantidad = cantidad || 1;

  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ id: producto.id, cantidad: cantidad });
  }

  actualizarCarrito();
  mostrarToast('🫒 ' + producto.nombre.split(' ').slice(0, 3).join(' ') + '... añadido');
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(function(p) { return p.id == id; });
  if (!item) return;
  item.cantidad += cambio;
  if (item.cantidad <= 0) {
    carrito = carrito.filter(function(p) { return p.id != id; });
  }
  actualizarCarrito();
}

function eliminarProducto(id) {
  carrito = carrito.filter(function(p) { return p.id != id; });
  actualizarCarrito();
}

function actualizarCarrito() {
  const listaEl = document.getElementById('lista-carrito');
  const totalSpan = document.getElementById('total');
  const emptyEl = document.getElementById('carrito-empty');
  const footerEl = document.getElementById('carrito-footer');
  const mayNoteEl = document.getElementById('carrito-mayorista-note');

  listaEl.innerHTML = '';
  let total = 0;
  let hayMayorista = false;

  if (carrito.length === 0) {
    emptyEl.classList.add('visible');
    if (footerEl) footerEl.style.display = 'none';
  } else {
    emptyEl.classList.remove('visible');
    if (footerEl) footerEl.style.display = 'block';
  }

  carrito.forEach(function(item) {
    const producto = productos.find(function(p) { return p.id == item.id; });
    const precioUnitario = obtenerPrecio(producto, item.cantidad);
    const subtotal = precioUnitario * item.cantidad;
    total += subtotal;
    const esMayorista = item.cantidad >= 6 && producto.precios.length > 1;
    if (esMayorista) hayMayorista = true;

    const li = document.createElement('li');
    li.className = 'item-carrito';
    li.innerHTML =
      '<div class="item-top">' +
        '<img class="item-img" src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
        '<div class="item-detalles">' +
          '<p class="item-nombre">' + producto.nombre + '</p>' +
          '<p class="item-precio-unit">S/ ' + precioUnitario.toFixed(2) + ' c/u</p>' +
          (esMayorista ? '<span class="item-may-tag">★ Precio mayorista</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="item-controls">' +
        '<div class="qty-controls">' +
          '<button onclick="cambiarCantidad(' + item.id + ', -1)">−</button>' +
          '<span class="qty-num">' + item.cantidad + '</span>' +
          '<button onclick="cambiarCantidad(' + item.id + ', 1)">+</button>' +
        '</div>' +
        '<span class="item-subtotal">S/ ' + subtotal.toFixed(2) + '</span>' +
      '</div>' +
      '<button class="btn-eliminar" onclick="eliminarProducto(' + item.id + ')">✕ Quitar del carrito</button>';

    listaEl.appendChild(li);
  });

  if (totalSpan) totalSpan.textContent = total.toFixed(2);
  totalCarrito = total;

  if (mayNoteEl) {
    mayNoteEl.style.display = hayMayorista ? 'block' : 'none';
  }

  actualizarContador();
}

function actualizarContador() {
  const badge = document.getElementById('contador-carrito');
  const totalItems = carrito.reduce(function(sum, item) { return sum + item.cantidad; }, 0);
  if (badge) badge.textContent = totalItems;
}

/* ===========================
   ABRIR / CERRAR CARRITO
=========================== */
function toggleCarrito() {
  document.getElementById('carrito').classList.toggle('activo');
  document.getElementById('carrito-overlay').classList.toggle('activo');
  document.body.style.overflow = document.getElementById('carrito').classList.contains('activo') ? 'hidden' : '';
}

function cerrarCarrito() {
  document.getElementById('carrito').classList.remove('activo');
  document.getElementById('carrito-overlay').classList.remove('activo');
  document.body.style.overflow = '';
}

/* ===========================
   COMPRAR POR WHATSAPP
=========================== */
function comprarWhatsApp() {
  if (carrito.length === 0) return;

  let mensaje = '🫒 *Pedido OLIBU*\n\n';
  let total = 0;

  carrito.forEach(function(item) {
    const producto = productos.find(function(p) { return p.id == item.id; });
    const precio = obtenerPrecio(producto, item.cantidad);
    const subtotal = precio * item.cantidad;
    total += subtotal;
    mensaje += '• ' + producto.nombre + '\n';
    mensaje += '  Cantidad: ' + item.cantidad + ' × S/ ' + precio.toFixed(2) + ' = S/ ' + subtotal.toFixed(2) + '\n\n';
  });

  mensaje += '─────────────────\n';
  mensaje += '*TOTAL: S/ ' + total.toFixed(2) + '*\n\n';
  mensaje += '📦 Por favor indicar dirección de entrega.';

  const url = 'https://wa.me/51950303041?text=' + encodeURIComponent(mensaje);
  window.open(url, '_blank');
}

/* ===========================
   TOAST
=========================== */
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add('visible');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(function() {
    toast.classList.remove('visible');
  }, 2500);
}

/* ===========================
   INICIALIZACIÓN
=========================== */
document.addEventListener('DOMContentLoaded', function() {
  generarCategorias();
  renderProductos();
  actualizarContador();
  renderDestacados();

  // Carrito
  const btnCarrito = document.getElementById('btn-carrito-flotante');
  if (btnCarrito) {
    btnCarrito.addEventListener('click', function(e) {
      e.preventDefault();
      toggleCarrito();
    });
  }

  const overlay = document.getElementById('carrito-overlay');
  if (overlay) {
    overlay.addEventListener('click', cerrarCarrito);
  }

  // Buscador
  const buscador = document.getElementById('buscador');
  if (buscador) {
    buscador.addEventListener('input', renderProductos);
  }

  // Botón pagar Culqi
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btn-pagar') {
      if (totalCarrito <= 0) {
        mostrarToast('El carrito está vacío');
        return;
      }
      if (typeof Culqi === 'undefined') {
        mostrarToast('Culqi no está disponible');
        return;
      }
      const culqi = new Culqi({ publicKey: 'TU_PUBLIC_KEY_AQUI' });
      culqi.settings({ title: 'Olibu', currency: 'PEN', amount: Math.round(totalCarrito * 100) });
      culqi.open();
    }
  });

  // Animaciones scroll general
  const scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.beneficio-card, .testimonio-card, .product-card').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    scrollObserver.observe(el);
  });
});

/* ===========================
   DESTACADOS
=========================== */
const IDS_DESTACADOS = [8, 12, 16, 18, 68, 70, 75, 92, 87, 91];

function renderDestacados() {
  const track = document.getElementById('destacados-track');
  if (!track) return;
  track.innerHTML = '';
  IDS_DESTACADOS.forEach(function(id) {
    const p = productos.find(function(x) { return x.id === id; });
    if (!p) return;
    const precioBase = obtenerPrecio(p, 1);
    const precioMay = p.precios.length > 1 ? p.precios[p.precios.length - 1] : null;
    const card = document.createElement('div');
    card.className = 'dest-card';
    card.innerHTML =
      '<div class="dest-img-wrap">' +
        '<img src="' + p.imagen + '" alt="' + p.nombre + '" loading="lazy">' +
        (precioMay ? '<span class="dest-tag">Mayorista</span>' : '') +
      '</div>' +
      '<div class="dest-info">' +
        '<p class="dest-cat">' + p.categoria + '</p>' +
        '<p class="dest-name">' + p.nombre + '</p>' +
        '<div class="dest-price-row">' +
          '<span class="dest-price">S/ ' + precioBase.toFixed(2) + '</span>' +
          (precioMay ? '<span class="dest-price-may">Mayor: S/ ' + precioMay.precio.toFixed(2) + '</span>' : '') +
        '</div>' +
        '<button class="dest-btn-agregar" data-id="' + p.id + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13"><path d="M12 5v14M5 12h14"/></svg>' +
          'Agregar' +
        '</button>' +
      '</div>';
    card.querySelector('.dest-img-wrap').addEventListener('click', function() { abrirModal(p.id); });
    card.querySelector('.dest-btn-agregar').addEventListener('click', function(e) {
      e.stopPropagation();
      agregarCarrito(p.id, 1);
    });
    track.appendChild(card);
  });
}

function scrollDestacados(dir) {
  const track = document.getElementById('destacados-track');
  if (!track) return;
  const card = track.querySelector('.dest-card');
  const ancho = card ? card.offsetWidth + 16 : 220;
  track.scrollBy({ left: dir * ancho * 2, behavior: 'smooth' });
}

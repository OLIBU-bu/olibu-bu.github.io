/* ================================================================
   OLIBU — CATÁLOGO DINÁMICO DESDE SUPABASE
   ================================================================
   Este archivo reemplaza al antiguo productos.js. Ya NO se edita
   el código para agregar, quitar o modificar productos: todo se
   hace desde el sistema (panel de inventario), que escribe
   directamente en las tablas `productos` y `producto_precios` de
   Supabase. Esta página solo LEE esos datos.

   Requiere que ya hayas corrido migracion-supabase.sql en tu
   proyecto de Supabase (crea la columna `imagen`, la tabla
   `producto_precios` y los permisos necesarios).
================================================================= */

const SB_URL = 'https://izwssilqdzuyztiekzej.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6d3NzaWxxZHp1eXp0aWVremVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4ODcwMzQsImV4cCI6MjA5NDQ2MzAzNH0.BPPI6-SpO9Ec5XPnipRmQ9fXY6-F7o5qCzv2BAI7nss';

// Variable global que usa el resto de script.js (renderProductos,
// renderDestacados, agregarCarrito, obtenerPrecio, etc.)
let productos = [];

async function cargarCatalogo() {
  try {
    const url =
      SB_URL +
      '/rest/v1/productos' +
      '?select=id,nombre,categoria,imagen,precio,stock,producto_precios(min,precio)' +
      '&activo=eq.true' +
      '&order=nombre.asc';

    const res = await fetch(url, {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY },
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    productos = data.map(function (p) {
      const tramos = (p.producto_precios || [])
        .map(function (t) { return { min: t.min, precio: parseFloat(t.precio) }; })
        .sort(function (a, b) { return a.min - b.min; });

      return {
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria || 'Otro',
        imagen: p.imagen || 'img/logo.png',
        stock: p.stock,
        precios: [{ min: 1, precio: parseFloat(p.precio) }].concat(tramos),
      };
    });
  } catch (e) {
    console.error('OLIBU catálogo:', e);
    productos = [];
    const contenedor = document.getElementById('lista-productos');
    if (contenedor) {
      contenedor.innerHTML =
        '<p style="padding:32px;text-align:center;color:#999;">' +
        'No se pudo cargar el catálogo. Intenta recargar la página.</p>';
    }
  }

  // Estas funciones ya existen en script.js
  if (typeof generarCategorias === 'function') generarCategorias();
  if (typeof renderProductos === 'function') renderProductos();
  if (typeof renderDestacados === 'function') renderDestacados();
}

document.addEventListener('DOMContentLoaded', cargarCatalogo);

// Refresca el catálogo cada 3 minutos por si se agregó/editó algo
// desde el sistema mientras alguien navega el sitio.
setInterval(cargarCatalogo, 180000);

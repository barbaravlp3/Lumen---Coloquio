// ======== IMPORTAMOS EL MODELO ========
import {
  seleccionarProductos,
  insertarProductos,
  actualizarProductos,
  eliminarProductos,
} from "../modelos/productos.js"; // Ajustá la ruta si es necesario

// ======== VARIABLES GLOBALES ========
const listaProductos = document.getElementById("lista-productos");
const modalProducto = document.getElementById("modal-producto");
const tituloModal = document.getElementById("titulo-modal-producto");
const formProducto = document.getElementById("form-producto");
const btnNuevo = document.getElementById("btn-nuevo-producto");
const btnCerrar = document.getElementById("cerrar-modal-producto");

let modoEdicion = false;
let idEditar = null;

// ======== MOSTRAR LISTA DE PRODUCTOS ========
async function cargarProductos() {
  try {
    const productos = await seleccionarProductos();
    listaProductos.innerHTML = "";

    if (!productos || productos.length === 0) {
      listaProductos.innerHTML = "<p>No hay productos disponibles.</p>";
      return;
    }

    productos.forEach((p) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.innerHTML = `
        <figure>
          <img src="${p.img_url}" alt="${p.nombre}">
        </figure>
        <div class="info-product">
          <h3>${p.nombre}</h3>
          <p class="price">$${parseFloat(p.precio).toFixed(2)}</p>
          <p>Stock: ${p.stock}</p>
          <div class="acciones">
            <button class="btn-editar" data-id="${p.id}">✏️ Editar</button>
            <button class="btn-eliminar" data-id="${p.id}">🗑️ Eliminar</button>
          </div>
        </div>
      `;
      listaProductos.appendChild(item);
    });

    // Eventos de editar y eliminar
    document.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", (e) => editarProducto(e.target.dataset.id));
    });
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => borrarProducto(e.target.dataset.id));
    });
  } catch (err) {
    console.error("Error al cargar productos:", err);
    listaProductos.innerHTML =
      "<p style='color:red'>Error al cargar productos.</p>";
  }
}

// ======== ABRIR MODAL NUEVO PRODUCTO ========
btnNuevo.addEventListener("click", () => {
  modoEdicion = false;
  idEditar = null;
  tituloModal.textContent = "🆕 Agregar Producto";
  formProducto.reset();
  modalProducto.classList.remove("hidden");
});

// ======== CERRAR MODAL ========
btnCerrar.addEventListener("click", () => {
  modalProducto.classList.add("hidden");
  formProducto.reset();
});

// ======== EDITAR PRODUCTO ========
async function editarProducto(id) {
  try {
    const productos = await seleccionarProductos();
    const producto = productos.find((p) => p.id == id);
    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    modoEdicion = true;
    idEditar = id;

    tituloModal.textContent = "✏️ Editar Producto";
    formProducto.nombre.value = producto.nombre;
    formProducto.precio.value = producto.precio;
    formProducto.stock.value = producto.stock;
    formProducto.img_url.value = producto.img_url;

    modalProducto.classList.remove("hidden");
  } catch (err) {
    console.error("Error al intentar editar:", err);
  }
}

// ======== BORRAR PRODUCTO ========
async function borrarProducto(id) {
  if (!confirm("¿Eliminar este producto?")) return;

  try {
    const res = await eliminarProductos(id); // ✅
    if (res.exito) {
      alert("✅ Producto eliminado correctamente");
      await cargarProductos(); // ✅ refresca lista
    } else {
      alert("⚠️ No se pudo eliminar el producto: " + (res.mensaje || ""));
    }
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    alert("❌ Error al conectar con el servidor");
  }
}

// ======== GUARDAR O ACTUALIZAR PRODUCTO ========
formProducto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = new FormData(formProducto);

  try {
    let res;
    if (modoEdicion) {
      datos.append("accion", "actualizar");
      datos.append("id", idEditar);
      res = await actualizarProductos(datos);
    } else {
      datos.append("accion", "insertar");
      res = await insertarProductos(datos);
    }

    if (res.exito || res.success) {
      alert(res.mensaje || "✅ Producto guardado correctamente");
      modalProducto.classList.add("hidden");
      formProducto.reset();
      await cargarProductos(); // ← asegúrate que espere la recarga
      // Mensaje flotante en pantalla
      const aviso = document.createElement("div");
      aviso.textContent = "✅ Producto guardado correctamente";
      aviso.classList.add("notificacion");
      document.body.appendChild(aviso);
      setTimeout(() => aviso.remove(), 3000);
    } else {
      alert("⚠️ Error: " + (res.mensaje || "No se pudo guardar"));
    }
  } catch (err) {
    console.error("Error al guardar producto:", err);
    alert("❌ Error al conectar con el servidor");
  }
});

// ======== INICIALIZAR ========
document.addEventListener("DOMContentLoaded", cargarProductos);

const URL = "/barbaravolpe/tp_coloquio/api/productos.php";

/**
 * Selecciona todos los productos
 */
export async function seleccionarProductos() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
}

/**
 * Inserta un nuevo producto
 */
export async function insertarProductos(formData) {
  const res = await fetch(URL, {
    method: "POST",
    body: formData,
  });

  // Si hubo error de servidor (404, 500, etc.)
  if (!res.ok) {
    const texto = await res.text();
    console.error("Respuesta del servidor (error HTTP):", texto);
    throw new Error("Error en la conexión con el servidor");
  }

  // Intentar parsear como JSON
  try {
    const data = await res.json();
    console.log("Respuesta JSON:", data);
    return data;
  } catch (err) {
    const texto = await res.text();
    console.error("Respuesta no válida (no es JSON):", texto);
    throw new Error("El servidor no devolvió un JSON válido");
  }
}

/**
 * Actualiza un producto existente
 */
export async function actualizarProductos(formData) {
  const res = await fetch(URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al actualizar producto");
  return await res.json();
}

/**
 * Elimina un producto por ID
 */
export async function eliminarProductos(id) {
  const formData = new FormData();
  formData.append("accion", "eliminar");
  formData.append("id", id);

  const res = await fetch(URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al eliminar producto");
  return await res.json();
}

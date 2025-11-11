
const URL = "/julia-rodriguez/barbaravolpe/tp_coloquio/api/usuario.php";

/**
 * Selecciona todos los usuarios
 */
export async function seleccionarUsuarios() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
}

/**
 * Inserta un nuevo usuario
 */
export async function insertarUsuarios(formData) {
  try {
    const res = await fetch(URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const textoError = await res.text();
      console.error("❌ Error HTTP:", textoError);
      throw new Error("Error en la conexión con el servidor");
    }

    // ✅ Intentar parsear el JSON UNA sola vez
    const texto = await res.text();
    console.log("⚙️ Respuesta cruda del servidor:", texto);

    let data;
    try {
      data = JSON.parse(texto);
    } catch (err) {
      console.error("⚠️ No se pudo parsear JSON:", err);
      throw new Error("El servidor devolvió una respuesta no válida.");
    }

    console.log("✅ JSON parseado correctamente:", data);
    return data;
  } catch (error) {
    console.error("Error en insertarUsuarios:", error);
    throw error;
  }
}

/**
 * Actualiza un usuario existente
 */
export async function actualizarUsuarios(formData) {
  const res = await fetch(URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al actualizar usuario");
  return await res.json();
}

/**
 * Elimina un usuario por ID
 */
export async function eliminarUsuarios(id) {
  const formData = new FormData();
  formData.append("accion", "eliminar");
  formData.append("id", id);

  const res = await fetch(URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al eliminar usuario");
  return await res.json();
}

  import { insertarUsuarios } from "../modelos/usuario.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerModal = document.getElementById('register-modal');
  const registerBtn = document.getElementById('register-btn');
  const closeBtn = document.getElementById('close-register');
  const form = document.getElementById("form-register");

  if (!registerModal || !registerBtn || !closeBtn || !form) {
    console.warn("Elementos del registro no encontrados en el DOM.");
    return;
  }

  // Mostrar el modal
  registerBtn.addEventListener('click', () => {
    registerModal.classList.remove('hidden');
  });

  // Cerrar el modal
  closeBtn.addEventListener('click', () => {
    registerModal.classList.add('hidden');
  });

  // Cerrar haciendo clic fuera del modal
  window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
      registerModal.classList.add('hidden');
    }
  });

  // Evento de envío del formulario
  form.addEventListener("submit", registerUser);
});

export async function registerUser(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre-registro")?.value.trim();
  const email = document.getElementById("email-registro")?.value.trim();
  const rol = document.getElementById("rol-registro")?.value;
  const contrasena = document.getElementById("contrasena-registro")?.value;
  const confirmar = document.getElementById("contrasena-confirm-registro")?.value;

  if (!nombre || !email || !rol || !contrasena || !confirmar) {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (contrasena !== confirmar) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("email", email);
  formData.append("rol", rol);
  formData.append("contrasena", contrasena);

  try {
    const resultado = await insertarUsuarios(formData);

    if (resultado.success) {
      alert("Usuario registrado correctamente");
      document.getElementById('register-modal').classList.add('hidden');
      event.target.reset(); // Limpia el formulario
    } else {
      alert("Error al registrar usuario: " + (resultado.message || ""));
    }
  } catch (error) {
    console.error(error);
    alert("Error al conectar con el servidor.");
  }
}

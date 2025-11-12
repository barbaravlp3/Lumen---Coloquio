import { insertarUsuarios } from "../modelos/usuario.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerModal = document.getElementById('register-modal');
  const registerBtn = document.getElementById('register-btn');
  const closeBtn = document.getElementById('close-register');
  const form = document.getElementById("form-register");
  const linkBack = document.getElementById('link-back-login');
  const loginModal = document.getElementById('login-modal');

  if (!registerModal || !registerBtn || !closeBtn || !form) {
    console.warn("Elementos del registro no encontrados en el DOM.");
    return;
  }

  // === Mostrar modal de registro ===
  registerBtn.addEventListener('click', () => {
    registerModal.classList.remove('hidden');
    loginModal?.classList.add('hidden');
    document.body.classList.add('modal-open');
  });

  // === Cerrar modal de registro ===
  closeBtn.addEventListener('click', () => {
    registerModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  });

  // === Cerrar haciendo clic fuera del contenido ===
  window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
      registerModal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }
  });

  // === Volver al login ===
  if (linkBack) {
    linkBack.addEventListener('click', (e) => {
      e.preventDefault(); // evita el salto del href="#"
      registerModal.classList.add('hidden');
      loginModal?.classList.remove('hidden');
      document.body.classList.add('modal-open');

      // Enfocar el primer campo del login (accesibilidad)
      const firstInput = loginModal?.querySelector('input, button, select');
      firstInput?.focus();
    });
  }

  // === Evento de envío del formulario ===
  form.addEventListener("submit", registerUser);
});

// === Función de registro ===
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
      document.body.classList.remove('modal-open');
      event.target.reset(); // limpia el formulario
    } else {
      alert("Error al registrar usuario: " + (resultado.message || ""));
    }
  } catch (error) {
    console.error(error);
    alert("Error al conectar con el servidor.");
  }
}
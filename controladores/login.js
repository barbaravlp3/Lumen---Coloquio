document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("login-modal");
  const loginBtn = document.getElementById("login-btn");
  const closeBtn = document.getElementById("close-login");
  const logoutBtn = document.getElementById("logout-btn");
  const loginForm = document.getElementById("login-form");
  const errorElement = document.getElementById("login-error");
  const adminActions = document.querySelector(".admin-actions"); // contenedor del botón

  function mostrarError(mensaje) {
    errorElement.textContent = mensaje;
    errorElement.classList.remove("hidden");
  }

  function actualizarEstadoLogin() {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    console.log("Token:", token, "Rol del usuario:", role);

    // Mostrar/ocultar botones de login/logout
    loginBtn.classList.toggle("hidden", !!token);
    logoutBtn.classList.toggle("hidden", !token);

    // Mostrar contenedor solo si el rol es ADMIN
    if (token && role === "ADMIN") {
      adminActions.classList.remove("hidden");
    } else {
      adminActions.classList.add("hidden");
    }
  }

  // Abrir modal login
  loginBtn.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
  });

  // Cerrar modal login
  closeBtn.addEventListener("click", () => {
    loginModal.classList.add("hidden");
  });

  // Cerrar modal al hacer click fuera
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.classList.add("hidden");
    }
  });

  // Procesar login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const contrasena = document.getElementById("contrasena").value;

    errorElement.classList.add("hidden");
    errorElement.textContent = "";

    if (!email || !contrasena) {
      mostrarError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("/barbaravolpe/tp_coloquio/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (result.success) {
        alert("✅ Usuario logueado correctamente");
        // Guardamos token y rol
        localStorage.setItem("authToken", "logueado");
        localStorage.setItem("userRole", result.usuario.rol);
        loginModal.classList.add("hidden");
        actualizarEstadoLogin();
      } else {
        mostrarError(result.error || "Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      mostrarError("❌ Error al conectar con el servidor.");
    }
  });

  // Procesar logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole"); // limpiamos el rol
    actualizarEstadoLogin();
    alert("👋 Sesión cerrada correctamente");
  });

  // Estado inicial al cargar la página
  actualizarEstadoLogin();
});

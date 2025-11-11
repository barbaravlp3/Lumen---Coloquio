document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("login-modal");
  const loginBtn = document.getElementById("login-btn");
  const closeBtn = document.getElementById("close-login");
  const logoutBtn = document.getElementById("logout-btn");
  const loginForm = document.getElementById("login-form");
  const errorElement = document.getElementById("login-error");

  function mostrarError(mensaje) {
    errorElement.textContent = mensaje;
    errorElement.classList.remove("hidden");
  }

  function actualizarEstadoLogin() {
    const token = localStorage.getItem("authToken");
    loginBtn.classList.toggle("hidden", !!token);
    logoutBtn.classList.toggle("hidden", !token);
  }

  loginBtn.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    loginModal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.classList.add("hidden");
    }
  });

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
      const response = await fetch(
        "/julia-rodriguez/barbaravolpe/tp_coloquio/api/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contrasena }), // 🔹 CAMBIO AQUÍ
        }
      );

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (result.success) {
        alert("✅ Usuario logueado correctamente");
        localStorage.setItem("authToken", "logueado");
        loginModal.classList.add("hidden");
        actualizarEstadoLogin();
      } else {
        mostrarError(result.error || "Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      mostrarError("❌ Error al conectar con el servidor.");
    }
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    actualizarEstadoLogin();
    alert("👋 Sesión cerrada correctamente");
  });

  actualizarEstadoLogin();
});

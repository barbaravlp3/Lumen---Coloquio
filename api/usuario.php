<?php
require_once 'modelos.php';
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$usuario = new ModeloABM("usuario");

try {
    // ================= POST =================
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $accion = $_POST["accion"] ?? "insertar";
        $id = trim($_POST["id"] ?? '');
        $nombre = trim($_POST["nombre"] ?? '');
        $email = trim($_POST["email"] ?? '');
        $contrasena = trim($_POST["contrasena"] ?? '');
        $rol = trim($_POST["rol"] ?? '');

        // 🗑️ ELIMINAR
        if ($accion === "eliminar" && !empty($id)) {
            $usuario->set_criterio("id=$id");
            $usuario->eliminar();
            echo json_encode([
                "success" => true,
                "message" => "Usuario eliminado correctamente."
            ]);
            exit;
        }

        // ➕ INSERTAR
        if ($accion === "insertar") {
            if (empty($nombre) || empty($rol) || empty($email) || empty($contrasena)) {
                echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
                exit;
            }

            // Verificar si el email ya existe
            $usuario->set_criterio("email = '$email'");
            $existe = json_decode($usuario->seleccionar(), true);
            if (count($existe) > 0) {
                echo json_encode(["success" => false, "message" => "Ya existe un usuario con ese correo."]);
                exit;
            }

            // Insertar nuevo usuario
            $hash = password_hash($contrasena, PASSWORD_DEFAULT);
            $datos = (object)[
                "nombre" => $nombre,
                "email" => $email,
                "contrasena" => $hash,
                "rol" => $rol
            ];

            // Si no hay error SQL, asumimos que se insertó correctamente
            $usuario->insertar($datos);
            echo json_encode([
                "success" => true,
                "message" => "Usuario registrado correctamente."
            ]);
            exit;
        }

        // ✏️ ACTUALIZAR
        if ($accion === "actualizar" && !empty($id)) {
            $usuario->set_criterio("id=$id");

            $datos = [
                "nombre" => $nombre,
                "email" => $email,
                "rol" => $rol
            ];

            if (!empty($contrasena)) {
                $datos["contrasena"] = password_hash($contrasena, PASSWORD_DEFAULT);
            }

            $usuario->actualizar($datos);
            echo json_encode([
                "success" => true,
                "message" => "Usuario actualizado correctamente."
            ]);
            exit;
        }

        // 🚫 Acción no válida
        echo json_encode(["success" => false, "message" => "Acción no válida o falta ID."]);
        exit;
    }

    // ================= GET =================
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        echo $usuario->seleccionar();
        exit;
    }

} catch (Throwable $e) {
    // ⚠️ Captura errores de ejecución o SQL
    $mensaje = $e->getMessage();

    // Detectar error de clave duplicada de MySQL
    if (str_contains($mensaje, 'Duplicate entry') && str_contains($mensaje, 'email')) {
        $mensaje = "Ya existe un usuario registrado con ese correo electrónico.";
    }

    echo json_encode([
        "success" => false,
        "message" => $mensaje
    ]);
    exit;
}
?>

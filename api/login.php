<?php
require_once 'modelos.php'; // Importa la clase que maneja la conexión

header('Content-Type: application/json; charset=utf-8');

// 🔹 Leer el cuerpo del request (JSON)
$input = json_decode(file_get_contents('php://input'), true);

// 🔹 Validar datos obligatorios
if (!isset($input['email']) || !isset($input['contrasena'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Faltan datos: email o contraseña'
    ]);
    exit;
}

$email = trim($input['email']);
$contrasena = $input['contrasena'];

// 🔹 Crear una instancia del modelo y obtener la conexión
$modelo = new Modelo();
$conn = $modelo->getConexion();

// 🔹 Preparar la consulta
$stmt = $conn->prepare("SELECT contrasena, nombre, rol FROM usuario WHERE email = ?");
if (!$stmt) {
    echo json_encode([
        'success' => false,
        'error' => 'Error al preparar la consulta: ' . $conn->error
    ]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// 🔹 Verificar si existe el usuario
if ($result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'error' => 'No existe un usuario con ese correo electrónico'
    ]);
    exit;
}

$row = $result->fetch_assoc();
$hashGuardado = $row['contrasena'];

// 🔹 Verificar la contraseña
if (password_verify($contrasena, $hashGuardado)) {
    echo json_encode([
        'success' => true,
        'mensaje' => 'Login exitoso',
        'usuario' => [
            'nombre' => $row['nombre'],
            'email' => $email,
            'rol' => $row['rol']
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Contraseña incorrecta'
    ]);
}

// 🔹 Cerrar recursos
$stmt->close();
$conn->close();
?>
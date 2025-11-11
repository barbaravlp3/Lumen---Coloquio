
<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'modelos.php';

// Determinar el método HTTP (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];
$carrito = new ModeloABM('carrito');

switch ($method) {
    // 📥 LISTAR o CONSULTAR PRODUCTO
    case 'GET':
        if (!empty($_GET['id'])) {
            $id = intval($_GET['id']);
            $carrito->set_criterio("id=$id");
        }
        $datos = $carrito->seleccionar();
        echo $datos;
        break;

    // ➕ AGREGAR PRODUCTO NUEVO AL CARRITO
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $nombre = $input['nombre'] ?? '';
        $descripcion = $input['descripcion'] ?? '';
        $precio = $input['precio'] ?? '';
        
       

        if ($nombre === '' || $descripcion === '' || $precio === '') {
            echo json_encode(['error' => 'Faltan campos obligatorios']);
            exit;
        }

        $valores = [
            'nombre' => $nombre,
            'descripcion' => $descripcion,
            'precio' => $precio,
           
            
        ];

        $resultado = $carrito->insertar($valores);
        echo json_encode(['mensaje' => 'Producto añadido al carrito', 'resultado' => $resultado]);
        break;

    // ✏️ MODIFICAR CARRITO EXISTENTE
    case 'PUT':
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['error' => 'ID inválido']);
        exit;
    }

    $valores = [];
    foreach (['nombre', 'descripcion','precio', ] as $campo) {
        if (isset($input[$campo])) $valores[$campo] = $input[$campo];
    }

    $carrito->set_criterio("id=$id");
    // ✅ corregido
    $resultado = $carrito->actualizar($valores);

    echo json_encode(['mensaje' => 'Carrito actualizado', 'resultado' => $resultado]);
    break;

    // ❌ ELIMINAR DEL CARRRITO
    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = intval($_DELETE['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(['error' => 'ID inválido']);
            exit;
        }

        $clientes->set_criterio("id=$id");
        $resultado = $clientes->eliminar();
        echo json_encode(['mensaje' => 'Eliminado del carrito', 'resultado' => $resultado]);
        break;

    default:
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>
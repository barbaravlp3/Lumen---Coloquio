<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'modelos.php';

$method = $_SERVER['REQUEST_METHOD'];
$productos = new ModeloABM('productos');

switch ($method) {

    // 📥 LISTAR o CONSULTAR PRODUCTOS
    case 'GET':
        if (!empty($_GET['id'])) {
            $id = intval($_GET['id']);
            $productos->set_criterio("id=$id");
        }
        $datos = $productos->seleccionar();
        echo $datos;
        break;

    // ➕ AGREGAR, ✏️ ACTUALIZAR o ❌ ELIMINAR PRODUCTO (según "accion")
    case 'POST':
        // Permitir tanto JSON como FormData
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $accion = $input['accion'] ?? 'insertar';

        // 🗑️ ELIMINAR PRODUCTO
        if ($accion === 'eliminar') {
            $id = intval($input['id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(['exito' => false, 'mensaje' => 'ID inválido']);
                exit;
            }

            $productos->set_criterio("id=$id");

            try {
                $productos->eliminar();
                echo json_encode(['exito' => true, 'mensaje' => 'Producto eliminado correctamente']);
            } catch (Exception $e) {
                echo json_encode(['exito' => false, 'mensaje' => 'Error al eliminar: ' . $e->getMessage()]);
            }
            break;
        }

        // ✏️ ACTUALIZAR PRODUCTO
        if ($accion === 'actualizar') {
            $id = intval($input['id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(['exito' => false, 'mensaje' => 'ID inválido']);
                exit;
            }

            $valores = [];
            foreach (['nombre', 'precio', 'stock', 'img_url'] as $campo) {
                if (isset($input[$campo])) $valores[$campo] = $input[$campo];
            }

            $productos->set_criterio("id=$id");

            try {
                $productos->actualizar((object)$valores);
                echo json_encode(['exito' => true, 'mensaje' => 'Producto actualizado correctamente']);
            } catch (Exception $e) {
                echo json_encode(['exito' => false, 'mensaje' => 'Error al actualizar: ' . $e->getMessage()]);
            }
            break;
        }

        // ➕ AGREGAR PRODUCTO NUEVO
        $nombre  = $input['nombre']  ?? '';
        $precio  = $input['precio']  ?? '';
        $stock   = $input['stock']   ?? '';
        $img_url = $input['img_url'] ?? '';

        if ($nombre === '' || $precio === '' || $stock === '' || $img_url === '') {
            echo json_encode(['exito' => false, 'mensaje' => 'Faltan campos obligatorios']);
            exit;
        }

        $valores = [
            'nombre'  => $nombre,
            'precio'  => $precio,
            'stock'   => $stock,
            'img_url' => $img_url
        ];

        try {
            $productos->insertar((object)$valores);
            echo json_encode(['exito' => true, 'mensaje' => 'Producto creado correctamente']);
        } catch (Exception $e) {
            echo json_encode(['exito' => false, 'mensaje' => 'Error al crear producto: ' . $e->getMessage()]);
        }
        break;

    default:
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Método no permitido'
        ]);
        break;
}
?>

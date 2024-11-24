<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$dbname = 'pim';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Cria a tabela 'orders'
    $sql_orders = "CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql_orders);

    // Cria a tabela 'payments'
    $sql_payments = "CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id)
    )";
    $pdo->exec($sql_payments);

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        error_log(print_r($data, true)); // Log para verificar os dados recebidos

        $product_name = $data['product_name'] ?? null;
        $quantity = $data['quantity'] ?? null;
        $total_price = $data['total_price'] ?? null;
        $payment_method = $data['payment_method'] ?? null;

        if ($product_name && $quantity && $total_price && $payment_method) {
            $sql = "INSERT INTO orders (product_name, quantity, total_price, payment_method) VALUES (:product_name, :quantity, :total_price, :payment_method)";
            $stmt = $pdo->prepare($sql);

            $stmt->bindParam(':product_name', $product_name);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':total_price', $total_price);
            $stmt->bindParam(':payment_method', $payment_method);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Pedido registrado com sucesso!"]);
            } else {
                echo json_encode(["message" => "Erro ao registrar o pedido."]);
            }
        } else {
            echo json_encode(["message" => "Por favor, forneça todos os detalhes do pedido."]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Erro na conexão: " . $e->getMessage()]);
}
?>

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

  if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $product = $data['product'] ?? null;
    $quantity = $data['quantity'] ?? null;
    $payment = $data['payment'] ?? null;

    if ($product && $quantity && $payment) {
      $sql = "INSERT INTO products (product, quantity, payment) VALUES (:product, :quantity, :payment)";
      $stmt = $pdo->prepare($sql);

      $stmt->bindParam(':product', $product);
      $stmt->bindParam(':quantity', $quantity);
      $stmt->bindParam(':payment', $payment);

      if ($stmt->execute()) {
        echo json_encode(["message" => "Compra registrada com sucesso!"]);
      } else {
        echo json_encode(["message" => "Erro ao registrar a compra."]);
      }
    } else {
      echo json_encode(["message" => "Por favor, forneça todos os detalhes da compra."]);
    }
  }
} catch (PDOException $e) {
  echo json_encode(["error" => "Erro na conexão: " . $e->getMessage()]);
}

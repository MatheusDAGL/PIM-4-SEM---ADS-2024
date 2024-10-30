<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$dbname = 'pim';
$username = 'root';
$password = '';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $email = $_GET['email'] ?? '';
    $password = $_GET['password'] ?? '';

    if ($email) {
      $sql = "SELECT * FROM users WHERE email = :email and password = '$password'";
      $stmt = $pdo->prepare($sql);
      $stmt->bindParam(':email', $email);
      $stmt->execute();

      if ($stmt->rowCount() > 0) {
        echo json_encode(["message" => "Email encontrado na base de dados.", "status" => 200]);
      } else {
        echo json_encode(["error" => "Email não encontrado ou senha incorreta.","status" => 401]);
      }
    } else {
      echo json_encode(["error" => "Por favor, forneça o email.", "status" => 404]);
    }
  }
} catch (PDOException $e) {
  echo json_encode(["error" => "Erro na conexão: " . $e->getMessage()]);
}

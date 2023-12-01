<?php
// Permite oricarei origini (nu este recomandat pentru producție)
header("Access-Control-Allow-Origin: *");

// Permitere anumite metode HTTP
header("Access-Control-Allow-Methods: POST");

// Permitere anumite antete HTTP
header("Access-Control-Allow-Headers: Content-Type");

date_default_timezone_set("Europe/Bucharest");

$server = "localhost";
$username = "root";
$password = "";
$database = "test";

$conn = mysqli_connect($server, $username, $password, $database);
if (!$conn) {
    die();
}

mysqli_query($conn, "SET time_zone = '+02:00'");

$sql = "SELECT * FROM prize_repartitions WHERE DATE(CONVERT_TZ(date, '+00:00', '+02:00')) = CURDATE()";

// Execută interogarea
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) === 1) {
    echo json_encode(["status" => "ok", "in_interval" => true]);
} else {
    echo json_encode(["status" => "ok", "in_interval" => false]);
}

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


// echo var_dump($_POST);

$json_data = file_get_contents("php://input");

// Decodifică JSON-ul într-un array asociativ



$data = json_decode($json_data, true);

$name = $data['name'];
$email = $data['email'];
$phone = $data['phone'];


if ($name !== null || $name !== "" || $email !== null || $email !== "" || $phone !== null || $phone !== "") {

    mysqli_query($conn, "SET time_zone = '+02:00'");

    $sql = "SELECT * FROM prize_repartitions WHERE DATE(CONVERT_TZ(date, '+00:00', '+02:00')) = CURDATE()";

    // Execută interogarea
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) === 1) {
        $row = mysqli_fetch_assoc($result);
        // echo var_dump($row);
        $prize_probabilities = json_decode($row['prize_probability']);

        $repartition_date = $row['date'];

        $random = mt_rand() / mt_getrandmax();
        $prizeIndex = null;
        $reserveIndex = null;
        $prize_won = null;

        $sql_is_winner = false;
        $sql_is_reserve = false;

        // echo var_dump(($prize_probabilities));
        $cumulativeProbability = 0;
        $totalSegments = count($prize_probabilities);
        for ($i = 0; $i < $totalSegments; $i++) {
            if ($prize_probabilities[$i]->quantity === null) {
                $prize_probabilities[$i]->allocated_quantity = INF;
                $prize_probabilities[$i]->quantity = INF;
                $prize_probabilities[$i]->allocated_reserves = INF;
                $prize_probabilities[$i]->reserves = INF;
            }

            $cumulativeProbability += $prize_probabilities[$i]->probability;

            if ($prize_probabilities[$i]->quantity > 0 && $random <= $cumulativeProbability) {
                $prizeIndex = $i;
                $reserveIndex = null;
                $prize_won = $prize_probabilities[$i]->name;
                break;
            } else if ($prize_probabilities[$i]->quantity === 0 && $prize_probabilities[$i]->reserves > 0 && $random <= $cumulativeProbability) {
                $prizeIndex = 0;
                $reserveIndex = $i;
                $prize_won = $prize_probabilities[$i]->name;
                break;
            } else {
                $prizeIndex = 0;
                $reserveIndex = null;
                $prize_won = $prize_probabilities[0]->name;

                // break;
            }
        }
        // echo var_dump($prize_probabilities);

        $date = date("Y-m-d H:i:s");

        // echo var_dump($prize_probabilities);
        if ($prizeIndex !== 0) {
            $sql_is_winner = true;
            $prize_probabilities[$i]->quantity = $prize_probabilities[$i]->quantity - 1;
        } else {
            if ($reserveIndex !== null) {
                $sql_is_reserve = true;
                $prize_probabilities[$i]->reserves = $prize_probabilities[$i]->reserves - 1;
            }
        }

        // echo var_dump($prize_probabilities);

        for ($i = 0; $i < $totalSegments; $i++) {
            if ($prize_probabilities[$i]->quantity === INF) {
                $prize_probabilities[$i]->allocated_quantity = null;
                $prize_probabilities[$i]->quantity = null;
                $prize_probabilities[$i]->allocated_reserves = null;
                $prize_probabilities[$i]->reserves = null;
            }
        }
        $prize_probabilities_json = json_encode($prize_probabilities);

        // echo var_dump($prize_probabilities_json);

        $sql_1 = "UPDATE `prize_repartitions` SET `prize_probability`='$prize_probabilities_json' WHERE `date`='$repartition_date'";

        if (mysqli_query($conn, $sql_1)) {
            // echo "schimbat cant";
            $sql = "INSERT INTO `campaing_entries`(`date`, `name`, `email`, `phone`, `is_winner`, `is_reserve`, `prize_won`) VALUES (?,?,?,?,?,?,?)";

            $stmt = mysqli_prepare($conn, $sql);

            if ($stmt === false) {
                die();
            }

            mysqli_stmt_bind_param($stmt, "sssssss", $date, $name, $email, $phone, $sql_is_winner, $sql_is_reserve, $prize_won);

            // echo "PRIZE INDEX - " . $prizeIndex;
            // echo "RESERVE INDEX - " . $reserveIndex;
            if (mysqli_stmt_execute($stmt)) {
                echo json_encode(["prize" => $prizeIndex, "reserve" => $reserveIndex, "prize-name" => $prize_probabilities[$prizeIndex]->name, "new_quant" => $prize_probabilities[$prizeIndex]->quantity, "random" => $random]);
            } else {
                echo json_encode(["status" => "error", "error" => mysqli_error($conn)]);
            }
        }

        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    }
}



// [{"name":"tryAgain","allocated_quantity":null,"quantity":null,"allocated_reserves":null,"reserves":null,"probability":0.7},
// {"name":"candy","allocated_quantity":1,"quantity":1,"allocated_reserves":3,"reserves":3,"probability":0.2},
// {"name":"emag","allocated_quantity":1,"quantity":1,"allocated_reserves":3,"reserves":3,"probability":0.1}]


// [{"name":"tryAgain","allocated_quantity":null,"quantity":null,"allocated_reserves":null,"reserves":null,"probability":0.2}, {"name":"candy","allocated_quantity":1,"quantity":1,"allocated_reserves":3,"reserves":3,"probability":0.5}, {"name":"emag","allocated_quantity":1,"quantity":1,"allocated_reserves":3,"reserves":3,"probability":0.3}]

// [{"name":"tryAgain","allocated_quantity":null,"quantity":null,"allocated_reserves":null,"reserves":null,"probability":0.2},{"name":"candy","allocated_quantity":5,"quantity":0,"allocated_reserves":3,"reserves":3,"probability":0.5},{"name":"emag","allocated_quantity":1,"quantity":0,"allocated_reserves":3,"reserves":2,"probability":0.3}]
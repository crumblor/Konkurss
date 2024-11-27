<?php
// Database connection
$host = 'localhost';
$dbname = 'puzzle_game'; // Replace with your database name
$username = 'root'; // Replace with your database username
$password = ''; // Replace with your database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Could not connect to the database $dbname :" . $e->getMessage());
}

// Get the form data
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $time = isset($_POST['time']) ? $_POST['time'] : '';

    if (!empty($name) && !empty($time)) {
        // Prepare the SQL query to insert data
        $sql = "INSERT INTO puzzle_results (name, time) VALUES (:name, :time)";
        $stmt = $pdo->prepare($sql);
        
        // Bind the parameters
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':time', $time);

        // Execute the query
        if ($stmt->execute()) {
            echo "Result saved successfully!";
        } else {
            echo "Failed to save result.";
        }
    } else {
        echo "Name and time are required.";
    }
}
?>

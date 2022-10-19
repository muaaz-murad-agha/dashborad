<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

$root = dirname(__DIR__) . DIRECTORY_SEPARATOR;

define('APP_PATH', $root . 'app' . DIRECTORY_SEPARATOR);
define('VIEWS_PATH', $root . 'views' . DIRECTORY_SEPARATOR);

require_once APP_PATH . 'config.php';
require_once APP_PATH . 'Request.php';

use App\Request;


$query = "SELECT a.created_at AS published, d.id, j.id AS project_id, j.user_id, u.name, d.customer_id, d.delivery_date, d.updated_at, d.type, (j.cost_location_id * 1) AS cost_location_id,
CASE price_unit WHEN 'pro Stück' THEN (p.amount * p.buying_price * 1)
WHEN 'pro 1.000 Stück' THEN (p.amount / 1000 * p.buying_price)
ELSE p.buying_price * 1 END AS buying_price,
CASE price_unit WHEN 'pro Stück' THEN (p.amount * p.retail_price * 1)
WHEN 'pro 1.000 Stück' THEN (p.amount / 1000 * p.retail_price)
ELSE p.retail_price * 1 END AS retail_price
FROM activities a JOIN documents d ON d.id = a.activityable_id
JOIN products p ON d.id = p.document_id
JOIN projects j ON d.project_id = j.id
JOIN users u ON j.user_id = u.id
WHERE a.action = 'customer-confirmation.published'
AND d.type = 'customer-confirmation'
AND d.status IN ('published', 'invoiced')
";




if($_SERVER["REQUEST_METHOD"] == "POST") {
    $requestForm = new Request( $_POST['published_from'],
                                $_POST['published_to'],
                                $_POST['delivery_date_from'],
                                $_POST['delivery_date_to']);

    if ($requestForm) {
        if ($requestForm->published_from) {
            $query = sprintf($query . " AND a.created_at >= '%s 00:00:00' ", $requestForm->published_from);
        }
        if ($requestForm->published_to) {
            $query = sprintf($query . " AND a.created_at <= '%s 23:59:59' ", $requestForm->published_to);
        }
        if ($requestForm->delivery_date_from) {
            $query = sprintf($query . " AND d.delivery_date >= '%s 00:00:00' ", $requestForm->delivery_date_from);
        }
        if ($requestForm->delivery_date_to) {
            $query = sprintf($query . " AND d.delivery_date <= '%s 23:59:59' ", $requestForm->delivery_date_to);
        }
    }
    //$query .= 'ORDER BY MONTH(DATE(a.created_at))';


    $outerQuery = "SELECT user_id AS Mitarbeiter_ID,
    name AS label,
    SUM(COALESCE(retail_price,0)) AS retail_price,
    SUM(COALESCE(buying_price,0)) AS buying_price,
    SUM(COALESCE(retail_price,0) - COALESCE(buying_price,0)) AS marge,
    COUNT(DISTINCT id) AS Produkte_insgesamt
    FROM ( $query ) AS T
    GROUP BY label, Mitarbeiter_ID;";
    

    $entries = $db->query($outerQuery)->fetchAll();
    $response = [];

    
    foreach($entries as $entry) {
        $response['labels'][] = $entry->label;
        $response['retail_price'][] = round($entry->retail_price, 2);
        $response['buying_price'][] = round($entry->buying_price, 2);
        $response['marge'][] = round($entry->marge, 2);
    }
    

    /*
    echo '<pre>';
    var_dump($response);
    echo '</pre>';
    */
    
    header('Content-Type: application/json; charset=utf-8');

    $json = json_encode($response);
    if ($json === false) {
        // Avoid echo of empty string (which is invalid JSON), and
        // JSONify the error message instead:
        $json = json_encode(["jsonError" => json_last_error_msg()]);
        if ($json === false) {
            // This should not happen, but we go all the way now:
            $json = '{"jsonError":"unknown"}';
        }
        // Set HTTP response status code to: 500 - Internal Server Error
        http_response_code(500);
    }

    echo $json;
    
}

?>
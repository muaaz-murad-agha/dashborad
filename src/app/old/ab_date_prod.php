<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

$root = dirname(__DIR__) . DIRECTORY_SEPARATOR;

define('APP_PATH', $root . 'app' . DIRECTORY_SEPARATOR);
define('VIEWS_PATH', $root . 'views' . DIRECTORY_SEPARATOR);

require_once APP_PATH . 'config.php';

use App\Request;


$userQuery = "SELECT SUM(COALESCE(retail_price,0)) AS retail_price, 
SUM(COALESCE(buying_price,0)) AS buying_price,
SUM(COALESCE(retail_price,0) - COALESCE(buying_price,0)) AS marge,
COUNT(DISTINCT id) AS amount,
DATE(published) date,
DATE_FORMAT(published, '%m.%d') as short_date,
YEAR(published) AS year
FROM (
SELECT a.created_at AS published, d.id, j.id AS project_id, j.user_id, d.customer_id, d.delivery_date, d.updated_at, d.type, (j.cost_location_id * 1) AS cost_location_id,
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
AND YEAR(DATE(a.created_at)) >= (YEAR(CURDATE()) - 1)
AND MONTH(DATE(a.created_at)) = MONTH(CURDATE())
AND DAY(DATE(a.created_at)) = DAY(CURDATE())

) AS T 
GROUP BY date, short_date, year
ORDER BY short_date
";

$entries = $db->query($userQuery)->fetchAll();

$year = date('Y');

$today = date('Y-m-d');

$begin = new DateTime($today);
$end = new DateTime($today);
$end = $end->modify('+1 day');
$interval = DateInterval::createFromDateString('1 hour');
$daterange = new DatePeriod($begin, $interval ,$end);

$dateTimes = [];

foreach($daterange as $date){
    $key = $date->format('Y-m-d');
    $data[$key]['amount'] = 0;
    $data[$key]['prev'] = 0;
    $data[$key]['difference'] = 0;
    $data[$key]['percentage'] = 0;
}






/*
header('Content-Type: application/json; charset=utf-8');

$json = json_encode($result);
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
*/

?>

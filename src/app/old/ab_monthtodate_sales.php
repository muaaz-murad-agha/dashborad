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
AND DATE(a.created_at) <= CURDATE()

) AS T 
GROUP BY date, short_date, year
ORDER BY short_date
";




$entries = $db->query($userQuery)->fetchAll();

/*
{
    date: "07.03",
    amount: 50,
    prev_amount: 40,
    difference: "+10"
    difference_percentage: "25%"

}
*/

$year = date('Y');
$today = date('Y-m-d H:i:s');
$data = [];



$period = new DatePeriod(
    new DateTime("$year-01-01"),
    new DateInterval('P1D'),
    new DateTime($today)
);

foreach ($period as $key => $value) {
    $str = $value->format('m.d');
    $data[$str]['amount'] = 0;
    $data[$str]['prev'] = 0;
    $data[$str]['difference'] = 0;
    $data[$str]['percentage'] = 0;

}

foreach($entries as $entry) {
    if($entry->year == $year) {
        $data[$entry->short_date]['amount'] = round($entry->retail_price, 2);
        $data[$entry->short_date]['difference'] = abs($data[$entry->short_date]['amount'] - $data[$entry->short_date]['prev']);

        if($data[$entry->short_date]['prev'] > 0) {
            $data[$entry->short_date]['percentage'] = ($data[$entry->short_date]['amount'] / $data[$entry->short_date]['prev']) * 100 - 100;
        }
        
    }
    else {
        $data[$entry->short_date]['prev'] = round($entry->retail_price, 2);
        $data[$entry->short_date]['difference'] = abs($data[$entry->short_date]['amount'] - $data[$entry->short_date]['prev']);

        if($data[$entry->short_date]['prev'] > 0) {
            $data[$entry->short_date]['percentage'] = ($data[$entry->short_date]['amount'] / $data[$entry->short_date]['prev']) * 100 - 100;
        }
        
        
    }
}

$result = [];
foreach ($period as $key => $value) {
    $dateKey = $value->format('m.d');
    $date = $value->format('d.m.');

    $result['day'][] = $date;
    $result['currentYear'][] = $data[$dateKey]['amount'];
    $result['previousYear'][] = $data[$dateKey]['prev'];
    $result['difference'][] = $data[$dateKey]['difference'];
    $result['percentage'][] = $data[$dateKey]['percentage'];

}




/*
echo '<pre>';
var_dump($result);
echo '</pre>';
*/



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

    

?>
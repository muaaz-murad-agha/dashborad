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

$query = "SELECT ROUND(SUM(COALESCE(retail_price,0)), 2) AS retail_price,
ROUND(SUM(COALESCE(buying_price,0)), 2) AS buying_price,
SUM(COALESCE(retail_price,0) - COALESCE(buying_price,0)) AS marge,
COUNT(DISTINCT id) AS amount,
#DATE_FORMAT(published, '%v') AS week,
WEEK(published, 1) AS week,
DATE_FORMAT(published, '%x') AS year

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
AND DATE_FORMAT(a.created_at, '%x') >= DATE_FORMAT(CURDATE(), '%x') -1
AND DATE_FORMAT(a.created_at, '%x') <= DATE_FORMAT(CURDATE(), '%x')
AND
CAST(CONCAT(IF(WEEK(a.created_at,1) < 10, '0' + WEEK(a.created_at,1), WEEK(a.created_at,1)),
    IF(WEEKDAY(a.created_at) < 10, '0' + WEEKDAY(a.created_at), WEEKDAY(a.created_at)) ) 
AS UNSIGNED)
<=
CAST(CONCAT(IF(WEEK(CURDATE(),1) < 10, '0' + WEEK(CURDATE(),1), WEEK(CURDATE(),1)), 
	IF(WEEKDAY(CURDATE()) < 10, '0' + WEEKDAY(CURDATE()), WEEKDAY(CURDATE())) )
AS UNSIGNED)


AND WEEK(DATE(a.created_at), 1) >= 1

) AS T
GROUP BY year, week
ORDER BY year, week;";


$entries = $db->query($query)->fetchAll();


// we split the queried data into two arrays.
// One will contain all the data of the current year while
// the other one weill contain all the data of the previous year.
$currentYearData = array_values(array_filter(
    $entries,
    function ($entry) {
        return $entry->year == date('Y');
    }
));

$prevYearData = array_values(array_filter(
    $entries,
    function ($entry) {
        return $entry->year == date('Y') - 1;
    }
));

//echo count($prevYearData) . "</br>";
//echo count($currentYearData) . "</br>";

// accumulate the values for each position in the array
$yearsData = ["prev" => $prevYearData, "current" => array_values($currentYearData)];

foreach ($yearsData as $key => $data) {
    for ($i = 1; $i < (count($data)); $i++) {

        $data[$i]->amount += $data[$i - 1]->amount;
        $data[$i]->retail_price += $data[$i - 1]->retail_price;
        $data[$i]->marge += $data[$i - 1]->marge;
    }
}


// rounding all the entries
$labels = array_map(
    function ($entry) {
        return $entry->week;
    },
    (count($yearsData["prev"]) > count($yearsData["current"])) ? $yearsData["prev"] : $yearsData["current"]
);

$sales = array_map(
    function ($entry) {
        return round((float)$entry->retail_price, 2);
    },
    $yearsData["current"]
);

$sales_prev = array_map(
    function ($entry) {
        return round((float)$entry->retail_price, 2);
    },
    $yearsData["prev"]
);

$amount = array_map(
    function ($entry) {
        return (int)$entry->amount;
    },
    $yearsData["current"]
);

$amount_prev = array_map(
    function ($entry) {
        return (int)$entry->amount;
    },
    $yearsData["prev"]
);

$marge = array_map(
    function ($entry) {
        return round($entry->marge, 2);
    },
    $yearsData["current"]
);

$marge_prev = array_map(
    function ($entry) {
        return round($entry->marge, 2);
    },
    $yearsData["prev"]
);

// build resulting array

$result = [
    "labels" => $labels,
    "sales" => $sales,
    "sales_prev" => $sales_prev,
    "amount" => $amount,
    "amount_prev" => $amount_prev,
    "marge" => $marge,
    "marge_prev" => $marge_prev,
];

// Fills all the remaining entries with the last element.
$numEntries = count($labels);
foreach ($result as &$value) {
    $value = array_merge($value, array_fill(count($value),  $numEntries - count($value), end($value)));
}

// We set the Content-Type Header to JSON and output our array "data" as json.

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

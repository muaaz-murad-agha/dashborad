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


// funtion to determine the beginning and end of a quarter
function get_start_and_end_date($case)
{
    $start = 'first day of ';
    $end = 'last day of ';

    if ($case == 'this_quarter') {
        $case = 'quarter_' . ceil((new DateTime)->format('n') / 3);
    }

    switch ($case) {
        case 'prev_month':
            $start .= 'previous month';
            $end .= 'previous month';
            break;
        default:
        case 'this_month':
            $start .= 'this month';
            $end .= 'this month';
            break;
        case 'next_month':
            $start .= 'next month';
            $end .= 'next month';
            break;
        case 'first_quarter':
        case 'quarter_1':
            $start .= 'January';
            $end .= 'March';
            break;
        case 'quarter_2':
            $start .= 'April';
            $end .= 'June';
            break;
        case 'quarter_3':
            $start .= 'July';
            $end .= 'September';
            break;
        case 'last_quarter':
        case 'quarter_4':
            $start .= 'October';
            $end .= 'December';
            break;
    }

    return [
        new DateTime($start),
        new DateTime($end),
    ];
}


$userQuery = "SELECT ROUND(SUM(COALESCE(retail_price,0)), 2) AS retail_price,
ROUND(SUM(COALESCE(buying_price,0)), 2) AS buying_price,
SUM(COALESCE(retail_price,0) - COALESCE(buying_price,0)) AS marge,
COUNT(DISTINCT id) AS amount,
DATE_FORMAT(published, '%Y') AS year,
DATE(published) AS date

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
WHERE a.action = 'customer-proposal.published'
AND d.type = 'customer-proposal'
AND d.status = 'published'
AND DATE_FORMAT(a.created_at, '%Y') >= DATE_FORMAT(CURDATE(), '%Y') -1
AND DATE_FORMAT(a.created_at, '%Y') <= DATE_FORMAT(CURDATE(), '%Y')
AND QUARTER(a.created_at) = QUARTER(CURDATE())

) AS T
GROUP BY year, date
ORDER BY year;";

$entries = $db->query($userQuery)->fetchAll();

/*
echo '<pre>';
var_dump($entries);
echo '</pre>';
*/


[$begin, $end] = get_start_and_end_date('this_quarter');
$end = new DateTime();


$interval = DateInterval::createFromDateString('1 day');
$daterange = new DatePeriod($begin, $interval, $end);

/*
labels,
amount,
amount_prev,
sales,
sales_prev,
*/

$dataByDate = [];
$labels = [];

foreach ($daterange as $date) {
    // Add date to as label
    $label = $date->format('d.m.');
    $labels['labels'][] = $label;

    // Create an entry for every date
    $dataByDate[$label]['amount']       = 0;
    $dataByDate[$label]['amount_prev']  = 0;
    $dataByDate[$label]['sales']        = 0;
    $dataByDate[$label]['sales_prev']   = 0;
    $dataByDate[$label]['marge']        = 0;
    $dataByDate[$label]['marge_prev']   = 0;
}

#echo "<pre>";
#var_dump($dataByDate);
#echo "</pre>";


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


// Here we merge the two arrays into the dataByDate array and fill in the
// data in their appropriate fields.
// fields ending with "_prev" contain the data of the previous year.

foreach ($currentYearData as $entry) {
    $ds = $entry->date;
    $datetime = DateTime::createFromFormat('Y-m-d', $ds);
    $index = $datetime->format('d.m.');
    $dataByDate[$index]['amount'] = $entry->amount;
    $dataByDate[$index]['sales'] = $entry->retail_price;
    $dataByDate[$index]['marge'] = $entry->marge;
}


foreach ($prevYearData as $entry) {
    $ds = $entry->date;
    $datetime = DateTime::createFromFormat('Y-m-d', $ds);
    $index = $datetime->format('d.m.');
    $dataByDate[$index]['amount_prev'] = $entry->amount;
    $dataByDate[$index]['sales_prev'] = $entry->retail_price;
    $dataByDate[$index]['marge_prev'] = $entry->marge;
}

#echo "<pre>";
#var_dump($dataByDate);
#echo "</pre>";


$data = $labels;

foreach ($daterange as $date) {
    // use data as index to access dataByDate
    $index = $date->format('d.m.');
    $element = $dataByDate[$index];
    $data['amount'][] = $element['amount'];
    $data['amount_prev'][] = $element['amount_prev'];
    $data['sales'][] = $element['sales'];
    $data['sales_prev'][] = $element['sales_prev'];
    $data['marge'][] = $element['marge'];
    $data['marge_prev'][] = $element['marge_prev'];
}


// Here we add the value of a field onto its sucessor such that
// the n-th element is the sum of the first up to the n-th element
for ($i = 1; $i < count($data['labels']); $i++) {
    $data['amount'][$i] += $data['amount'][$i - 1];
    $data['amount_prev'][$i] += $data['amount_prev'][$i - 1];
    $data['sales'][$i] += $data['sales'][$i - 1];
    $data['sales_prev'][$i] += $data['sales_prev'][$i - 1];
    $data['marge'][$i] += $data['marge'][$i - 1];
    $data['marge_prev'][$i] += $data['marge_prev'][$i - 1];
}

// At the end the round all the fields that contain floating point values
for ($i = 0; $i < count($data['labels']); $i++) {
    $data['sales'][$i] = round($data['sales'][$i], 2);
    $data['sales_prev'][$i] = round($data['sales_prev'][$i], 2);
    $data['marge'][$i] = round($data['marge'][$i], 2);
    $data['marge_prev'][$i] = round($data['marge_prev'][$i], 2);
}





header('Content-Type: application/json; charset=utf-8');

$json = json_encode($data);
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

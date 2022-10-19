<?php

declare(strict_types=1);

namespace App;

class Request {
    public $published_from;
    public $published_to;
    public $delivery_date_from;
    public $delivery_date_to;

    public function __construct(string $p_from, string $p_to, string $d_from, string $d_to) {
        
        if($time = strtotime($p_from)) {
            $this->published_from = date('Y-m-d', $time);
        }
        if($time = strtotime($p_to)) {
            $this->published_to = date('Y-m-d', $time);
        }
        if($time = strtotime($d_from)) {
            $this->delivery_date_from = date('Y-m-d', $time);
        }
        if($time = strtotime($d_to)) {
            $this->delivery_date_to = date('Y-m-d', $time);
        }
    }
}

<?php
require_once("CPD_SLIPRATE.php");

$cpd_sliprate = new CPD_SLIPRATE();

$type = $_REQUEST["t"];
$criteria = json_decode($_REQUEST["q"]);

//$type = 'location';
//$criteria = array();
//array_push($criteria, 35.0522);
//array_push($criteria, -118.2437);

if (is_object($criteria[0])) {
     $criteria = (array)$criteria[0];
}

//print_r($criteria);exit;

try {
    print $cpd_sliprate->search($type, $criteria)->outputJSON();
} catch (BadFunctionCallException $e) {
    print "cpd_sliprate search error";
}

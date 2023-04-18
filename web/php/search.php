<?php
require_once("CPD_SLIPRATE.php");

$cpd_sliprate = new SLIPRATE();

$type = $_REQUEST["t"];
$criteria = json_decode($_REQUEST["q"]);

//$type = 'faultname';
//$criteria = array();
//array_push($criteria, 'Almanor');

if (is_object($criteria[0])) {
     $criteria = (array)$criteria[0];
}

//print_r($criteria);exit;

try {
    print $cpd_sliprate->search($type, $criteria)->outputJSON();
} catch (BadFunctionCallException $e) {
    print "cpd_sliprate search error";
}

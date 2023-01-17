<?php
require_once("SpatialData.php");

class SLIPRATE extends SpatialData
{
  function __construct()
  {
    $this->connection = pg_connect("host=db port=5432 dbname=CPD_sliprate_db user=webonly password=scec");
    if (!$this->connection) { die('Could not connect'); }
  }

// 
  public function search($type, $criteria="")
  {
    if (!is_array($criteria)) {
      $criteria = array($criteria);
    }
    $query = "";
    $error = false;

    switch ($type) {
      case "location":
        return $this;
        break;
      case "latlon":
        if (count($criteria) !== 4) {
          $error = true;
        }

        $criteria = array_map("floatVal", $criteria);
        list($firstlat, $firstlon, $secondlat, $secondlon) = $criteria;

        $minlon = $firstlon;
        $maxlon = $secondlon;
        if($firstlon > $secondlon) {
          $minlon = $secondlon;
          $maxlon = $firstlon;
        }

        $minlat = $firstlat;
        $maxlat = $secondlat;
        if($firstlat > $secondlat) {
          $minlat = $secondlat;
          $maxlat = $firstlat;
        }
        return $this;
        break;

      }
      $this->php_result = "BAD";
      return $this;
  }

  public function getStationCount()
  {
  }

  public function getAllStationData()
  {
    $query = "SELECT gid,sliprateid,x,y,faultname,sitename,lowrate,highrate,state,datatype,qbinmin,qbinmax,x2014dip,x2014rake,x2014rate,reference from sliprate_db LIMIT 10";

    $result = pg_query($this->connection, $query);

    $sliprate_data = array();

    while($row = pg_fetch_object($result)) {
      $sliprate_data[] = $row;
    }

    $this->php_result = $sliprate_data;
    return $this;
  }
}

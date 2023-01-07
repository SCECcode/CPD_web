<?php
require_once("SpatialData.php");

class SLIPRATE extends SpatialData
{
  function __construct()
  {
    $this->connection = pg_connect("host=db port=5432 dbname=CPD_sliprate_db user=webonly password=scec");
    if (!$this->connection) { die('Could not connect'); }
  }

  public function search($type, $criteria)
  {
    // TODO: Implement search() method.
  }

  public function getAllStationData()
  {
    $query = "SELECT sliprateid,x,y,faultname,sitename,lowrate,highrate,state,datatype,qbinmin,qbinmax,x2014dip,x2014rake,x2014rate,reference from sliprate_db LIMIT 10";

    $result = pg_query($this->connection, $query);

    $sliprate_data = array();

    while($row = pg_fetch_object($result)) {
      $sliprate_data[] = $row;
    }

    $this->php_result = $sliprate_data;
    return $this;
  }
}

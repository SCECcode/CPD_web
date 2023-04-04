<?php
require_once("SpatialData.php");

class SLIPRATE extends SpatialData
{
  function __construct()
  {
    print("<br>Calling pg_connect<br>");
    $this->connection = pg_connect("host=db port=5432 dbname=CPD_sliprate_db user=webonly password=scec");
    if (!$this->connection) 
    {
	    print('Could not connect<br>');
	    var_dump($this->connection);
	    print('<br>');
    }
//    $this->connection = pg_connect("host=db port=5432 dbname=CPD_sliprate_db user=webonly password=scec");
//    if (!$this->connection) { die('Could not connect'); }
  }

  public function search($type, $criteria="")
  {
    $query = "";

    switch ($type) {
      case "faultname":
        break;
      case "sitename":
        break;
      case "minrateslider":
        break;
      case "maxrateslider":
        break;
      case "latlon":
        if (!is_array($criteria)) {
         $criteria = array($criteria);
        }

        if (count($criteria) !== 4) {
          $this->php_result = "BAD";
          return $this;
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

        $query = "SELECT gid FROM sliprate_db WHERE ST_INTERSECTS(ST_MakeEnvelope( $1, $2, $3, $4, 4326), sliprate_db.geom)";
        $data = array($minlon, $minlat, $maxlon, $maxlat);
        $result = pg_query_params($dbconn, $query, $data);

        $sliprate_data = array();

        while($row = pg_fetch_object($result)) {
          $sliprate_data[] = $row;
        }

        $this->php_result = $sliprate_data;
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

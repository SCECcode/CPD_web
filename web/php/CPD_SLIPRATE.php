<?php
require_once("SpatialData.php");

class SLIPRATE extends SpatialData
{
  function __construct()
  {
    $this->connection = pg_connect("host=db port=5432 dbname=SLIPRATE_db user=webonly password=scec");
    if (!$this->connection) { die('Could not connect'); }
//    $this->connection = pg_connect("host=db port=5432 dbname=CPD_sliprate_db user=webonly password=scec");
//    if (!$this->connection) { die('Could not connect'); }
  }

  public function search($type, $criteria="")
  {
    $query = "";
    if (!is_array($criteria)) {
      $criteria = array($criteria);
    }
    $error = false;

    switch ($type) {
      case "faultname":
        if (count($criteria) !== 1) {
          $this->php_result = "BAD";
          return $this;
        }
	list($faultname) = $criteria;

	$query = "SELECT gid, sliprateid, faultname FROM sliprate_db WHERE to_tsvector(faultname) @@ plainto_tsquery($1)";
 	$data = array($faultname);
        $result = pg_query_params($dbconn, $query, $data);

        $sliprate_data = array();
 
        while($row = pg_fetch_object($result)) { $sliprate_data.push($row[0]); }

	$this->php_result = $sliprate_data;
        return $this;
        break;


        break;
      case "sitename":
        break;
      case "minrate":
        break;
      case "maxrate":
        break;
      case "latlon":
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
    $query = "SELECT gid,sliprateid,x,y,faultname,sitename,lowrate,highrate,state,datatype,qbinmin,qbinmax,x2014dip,x2014rake,x2014rate,reference from sliprate_tb LIMIT 10";
//    $query = "SELECT gid,sliprateid,x,y,faultname,sitename,lowrate,highrate,state,datatype,qbinmin,qbinmax,x2014dip,x2014rake,x2014rate,reference from sliprate_tb";

    $result = pg_query($this->connection, $query);

    $sliprate_data = array();

    while($row = pg_fetch_object($result)) {
      $sliprate_data[] = $row;
    }

    $this->php_result = $sliprate_data;
    return $this;
  }
}

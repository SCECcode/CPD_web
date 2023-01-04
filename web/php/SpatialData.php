<?php


abstract class SpatialData
{
	protected $connection;
	protected $php_result = [];

//	function __construct()
//	{
//		$this->connection = pg_connect("host=db port=5432 dbname=CFM52_db user=webonly password=scec");
//		if (!$this->connection) { die('Could not connect'); }
//	}

	abstract public function search($type, $criteria);

	public function outputJSON()
	{
		return json_encode($this->php_result,JSON_UNESCAPED_SLASHES);
	}

}


<?php


abstract class SpatialData
{
  protected $connection;
  protected $php_result = [];

  abstract public function search($type, $criteria);

  public function outputJSON()
  {
    return json_encode($this->php_result,JSON_UNESCAPED_SLASHES);
  }
}


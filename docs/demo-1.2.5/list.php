<?php
require_once('lib/core.php');
require_once('configs.php');

$db = new Model('extgrid');

$size = isset($_REQUEST['pageSize']) ? $_REQUEST['pageSize'] : 10;
$page = isset($_REQUEST['pageNumber']) ? $_REQUEST['pageNumber'] : 1;

$list = array();

$count = $db->count();

$results = $db->limit($size)->page($page)->select();

$list['totla'] = $count;
$list['rows'] = $results;
$list['time'] = G('start',1)*1000;

echo json_encode($list);
?>
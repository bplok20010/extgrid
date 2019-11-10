<?php
require_once('lib/core.php');
require_once('configs.php');

$db = new Model('extgrid');
$action = isset($_REQUEST['action']) && $_REQUEST['action'] == 'delete' ? 'delete' : 'add';
if( $action == 'delete' ) {
	$db->create();
	echo $db->delete();
	exit;
}
if( $_POST['id'] == -1 ) {
	unset($_POST['id']);
	$db->create();
	echo $db->add();
} else {
	$db->create();
	$db->save();
	echo $_POST['id'];
}
?>
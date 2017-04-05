<?php
require_once '../common/php/const.php';
require_once '../common/php/util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

//------------------------------------------------------------------------------
switch ($_POST['cmd']) {
	case 'register':
		echo json_encode(fRegister($_POST));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
}

//------------------------------------------------------------------------------
function fRegister(
	$vArgs
)
{
	global $kDbSuccess, $kDbError, $kDbDuplicate;
	
	if (fDbGetUserByEmail($vArgs['email']) != null) {
		return array(
			'errno' => $kDbDuplicate
		);
	}
	
	if (fDbRegister($vArgs)) {
		return array(
			'errno' => $kDbSuccess
		);
	}
	
	return array(
		'errno' => $kDbError
	);
}

//-----------------------------------------------------------------------------------------
function fDbRegister(
    $vArgs
)
{
    global $vConn;
	
	$q = sprintf("
		INSERT INTO tblYMUser
		SET email = '%s', password = '%s'
	", $vArgs['email'], $vArgs['password']);
	
	return mysqli_query($vConn, $q);
}

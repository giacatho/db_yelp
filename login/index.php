<?php
require_once '../const.php';
require_once '../util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

//------------------------------------------------------------------------------
switch ($_POST['cmd']) {
	case 'login':
		echo json_encode(fLogin($_POST));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
}

//------------------------------------------------------------------------------
function fLogin(
	$vArgs
) 
{
	global $kDbSuccess, $kDbError, $kDbNotFound;
	
	$vUser = fDbGetUserByEmail($vArgs['email']);
	if ($vUser == null || $vUser['password'] != $vArgs['password']) {
		return array(
			'errno' => $kDbNotFound
		);
	}
	
	// Login successfully!
	$vSessionId = uuid();
	if (!fDbAddSession($vSessionId, $vUser['ym_user_id'])) {
		return array(
			'errno' => $kDbError
		);
	}
	
	return array(
		'errno' => $kDbSuccess,
		'data' => array (
			'session_id' => $vSessionId
		)
	);
}

//-----------------------------------------------------------------------------
function fDbAddSession(
	$vSessionId, 
	$vYMUserId
)
{
	global $vConn;
	
	$q = sprintf("
		INSERT INTO tblYMSession
		SET
			session_id = '%s',
			ym_user_id = '%s',
			timestamp = %d", $vSessionId, $vYMUserId, time());
	
	return mysqli_query($vConn, $q);	
}
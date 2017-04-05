<?php
require_once '../common/php/const.php';
require_once '../common/php/util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

//------------------------------------------------------------------------------
switch ($_POST['cmd']) {
	case 'logout':
		echo json_encode(fLogout($_POST));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
}

//------------------------------------------------------------------------------
function fLogout(
	$vArgs
) 
{
	global $kDbSuccess, $kDbError;
	
	if (!fDbRemoveSession($vArgs['session_id'])) {
		return array(
			'errno' => $kDbError
		);
	}
	
	return array(
		'errno' => $kDbSuccess,
	);
}

//-----------------------------------------------------------------------------
function fDbRemoveSession(
	$vSessionId
)
{
	global $vConn;
	
	$q = sprintf("
		DELETE FROM tblYMSession
		WHERE
			session_id = '%s'", $vSessionId);
	
	return mysqli_query($vConn, $q);	
}
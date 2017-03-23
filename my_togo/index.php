<?php
require_once '../const.php';
require_once '../util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

//------------------------------------------------------------------------------
switch ($_POST['cmd']) {
	case 'get_data':
		fSessionWall($_POST);
		echo json_encode(fGetData($_POST));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
}

//------------------------------------------------------------------------------
function fGetData(
	$vArgs
) {
	global $kDbSuccess, $kDbError;
	
	$vBusinesses = fDbGetToGoBusiness($vArgs);
	
    return array(
        'errno' => $kDbSuccess,
        'data' => array(
            'businesses' => $vBusinesses
        )
    );

    err:
    return array('errno' => $kDbError);
}

//-----------------------------------------------------------------------------------------
function fDbGetToGoBusiness(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT b.business_id, b.name, b.full_address, b.stars, b.review_count, b.categories, 
			b.latitude, b.longitude   
		FROM tblYMTogo a
			JOIN tblBusiness b
				ON a.business_id = b.business_id
		WHERE a.ym_user_id = %d
		LIMIT %d, %d", 
			$vArgs['ym_user_id'],
			$vArgs['fetch_offset'], $vArgs['fetch_len']);
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}
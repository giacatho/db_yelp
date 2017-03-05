<?php
require_once '../const.php';
require_once '../util.php';

$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);

// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

switch ($_POST['cmd']) {
	case 'get_data':
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
	
	$vBusinesses = fDbSearchBusiness();
	
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
function fDbSearchBusiness(
)
{
	global $vConn;
	
	$q = "
		SELECT business_id, name, full_address, stars, review_count  
		FROM tblBusiness
		ORDER BY name
		LIMIT 25
	";
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}
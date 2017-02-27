<?php
require_once '../const.php';
require_once '../util.php';

$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);

switch ($_POST['cmd']) {
	case 'get_coolest_restaurants':
		echo json_encode(fGetCoolestRestaurants($_POST));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
}

//------------------------------------------------------------------------------
function fGetCoolestRestaurants(
	$vArgs
) {
	global $kDbSuccess, $kDbError;
	
	$vRestaurants = fDbGetCoolestRestaurants();
	
    return array(
        'errno' => $kDbSuccess,
        'data' => array(
            'restaurants' => $vRestaurants
        )
    );

    err:
    return array('errno' => $kDbError);
}
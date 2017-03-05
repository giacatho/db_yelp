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

//-----------------------------------------------------------------------------------------
function fDbGetCoolestRestaurants(
)
{
	global $vConn;
	
	$q = " 
		SELECT b.business_id, b.name, SUM(r.`vote.cool`) AS coolness
		FROM tblReview r 
			JOIN tblBusiness b
				ON r.business_id = b.business_id
			JOIN tblBusinessCategory c
				ON c.business_id = b.business_id
		WHERE c.category LIKE '%Restaurants%'
		GROUP BY b.business_id, b.name
		ORDER BY coolness DESC
		LIMIT 25
	";

	// This is for testing, it's quick to run
//	$q = sprintf(" 
//		SELECT b.`business_id`, b.`name`, 30 AS coolness
//			FROM tblBusiness b
//		LIMIT 25
//	");
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}
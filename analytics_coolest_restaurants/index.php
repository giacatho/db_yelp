<?php
require_once '../const.php';
require_once '../util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

switch ($_GET['cmd']) {
	case 'get_coolest_restaurants':
		echo json_encode(fGetCoolestRestaurants($_GET));
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
	
	// This original takes a lot of time (~20 mins) to run. 
	// So cache the result into another table
//	$q = " 
//		SELECT b.business_id, b.name, b.full_address, SUM(r.`vote.cool`) AS coolness
//		FROM tblReview r 
//			JOIN tblBusiness b
//				ON r.business_id = b.business_id
//			JOIN tblBusinessCategory c
//				ON c.business_id = b.business_id
//		WHERE c.category LIKE '%Restaurants%'
//		GROUP BY b.business_id, b.name
//		ORDER BY coolness DESC
//		LIMIT 25
//	";

	$q = " 
		SELECT business_id, business_name AS name, full_address, coolness
		FROM cacheCoolestRestaurants 
		ORDER BY coolness DESC
		LIMIT 25
	";
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

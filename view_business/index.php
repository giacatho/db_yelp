<?php
require_once '../const.php';
require_once '../util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

//------------------------------------------------------------------------------
switch ($_POST['cmd']) {
	case 'get_review_summary':
		echo json_encode(fGetReviewSummary($_POST));
		break;
		
	case 'get_reviews':
		echo json_encode(fGetReviews($_POST));
		break;
	
	case 'get_nearby_businesses':
		echo json_encode(fGetNearbyBusinesses($_POST));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
}

//------------------------------------------------------------------------------
function fGetReviewSummary(
	$vArgs
) {
	global $kDbSuccess, $kDbError;
	
	$vReviewSummary = fDbGetReviewSummary($vArgs);
	
    return array(
        'errno' => $kDbSuccess,
        'data' => array(
			'review_summary' => $vReviewSummary
        )
    );

    err:
    return array('errno' => $kDbError);
}

//------------------------------------------------------------------------------
function fGetReviews(
	$vArgs
) {
	global $kDbSuccess, $kDbError;
	
	$vReviews = fDbSearchReviews($vArgs);
	
    return array(
        'errno' => $kDbSuccess,
        'data' => array(
            'reviews' => $vReviews
        )
    );

    err:
    return array('errno' => $kDbError);
}

//-----------------------------------------------------------------------------------------
function fGetNearbyBusinesses(
	$vArgs
) {
	global $kDbSuccess;
	
	return array(
        'errno' => $kDbSuccess,
        'data' => array(
            'nearby_businesses' => fDbGetNearbyBusinesses($vArgs)
        )
    );
}

//-----------------------------------------------------------------------------------------
function fDbGetReviewSummary(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT stars, COUNT(*) AS total
		FROM tblReview
		WHERE business_id = '%s'
		GROUP BY stars
		ORDER BY stars", 
			$vArgs['business_id']);
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fDbSearchReviews(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT b.name AS author, a.text, a.stars, a.date, 
			a.`vote.cool` AS cool, a.`vote.funny` AS funny, a.`vote.useful` AS useful
		FROM tblReview a
			JOIN tblUser b
				ON a.user_id = b.user_id
		WHERE a.business_id = '%s'
		ORDER BY a.date DESC
		LIMIT %d, %d", 
			$vArgs['business_id'],
			$vArgs['fetch_offset'], $vArgs['fetch_len']);
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fDbGetNearbyBusinesses(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT dest.business_id, dest.name, dest.full_address, dest.stars, dest.review_count, 
			dest.categories, dest.latitude, dest.longitude, 
			3956 * 2 * ASIN(SQRT(POWER(SIN((orig.latitude - dest.latitude) * pi()/180 / 2), 2) +  COS(orig.latitude * pi()/180) *  COS(dest.latitude * pi()/180) *  POWER(SIN((orig.longitude - dest.longitude) * pi()/180 / 2), 2)  )) AS distance 
			FROM tblBusiness orig, tblBusiness dest
		WHERE orig.business_id = '%s' AND orig.business_id <> dest.business_id
			AND orig.state = dest.state AND orig.city = dest.city 
		ORDER BY distance
		LIMIT 10", $vArgs['business_id']);
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}
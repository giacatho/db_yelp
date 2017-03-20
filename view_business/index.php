<?php
require_once '../const.php';
require_once '../util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

//------------------------------------------------------------------------------
switch ($_POST['cmd']) {
	case 'get_reviews':
		echo json_encode(fGetReviews($_POST));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
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
function fDbGetTopCategories()
{
	global $vConn;
	
	$q = sprintf("
		SELECT category, COUNT(business_id) business_count
		FROM tblBusinessCategory
		GROUP BY category
		HAVING business_count > 1000
		ORDER BY business_count DESC");
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fDbGetCities()
{
	global $vConn;
	
	$q = sprintf("
		SELECT DISTINCT city, state
		FROM tblBusiness
		WHERE state <> '' AND city <> ''
		ORDER BY state");
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}
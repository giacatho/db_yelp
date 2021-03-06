<?php
require_once '../common/php/const.php';
require_once '../common/php/util.php';

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
	
	case 'get_recommended_businesses':
		echo json_encode(fGetRecommendedBusinesses($_POST));
		break;
	
	case 'add_togo':
		if (!fSessionWall($_POST)) {
			echo json_encode(array('errno' => $kDbInvalidSession));
			exit;
		}
		
		echo json_encode(fAddTogo($_POST));
		break;
	
	case 'get_statistics':
		echo json_encode(fGetStatistics($_POST));
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

//-----------------------------------------------------------------------------------------
function fGetRecommendedBusinesses(
	$vArgs
) {
	global $kDbSuccess;
	
	return array(
        'errno' => $kDbSuccess,
        'data' => array(
            'also_reviewed_businesses' => fDbGetAlsoReviewedBusinesses($vArgs),
			'also_tipped_businesses' => fDbGetAlsoTippedBusinesses($vArgs)
        )
    );
}

//-----------------------------------------------------------------------------------------
function fDbGetAlsoReviewedBusinesses(
	$vArgs
)
{
	global $vConn;
	
	// 1. Get all users who review this busines.
	// 2. Get all reviews make by the users.
	// 3. Get business_id, count(review) from those reviews.
	// 4. Get the top 10 business
	$q = sprintf("
		SELECT b.business_id, c.name, c.full_address, c.stars, c.review_count, c.categories, 
			c.latitude, c.longitude, COUNT(*) AS common_review_count
		FROM tblReview a
			JOIN tblReview b
				ON a.user_id = b.user_id
			JOIN tblBusiness c
				ON b.business_id = c.business_id
		WHERE a.business_id = '%s'
			AND b.business_id <> a.business_id
		GROUP BY b.business_id
		ORDER BY common_review_count DESC
		LIMIT 10
		", $vArgs['business_id']);
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fDbGetAlsoTippedBusinesses(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT b.business_id, c.name, c.full_address, c.stars, c.review_count, c.categories, 
			c.latitude, c.longitude, COUNT(*) AS common_tip_count
		FROM tblTip a
			JOIN tblTip b
				ON a.user_id = b.user_id
			JOIN tblBusiness c
				ON b.business_id = c.business_id
		WHERE a.business_id = '%s'
			AND b.business_id <> a.business_id
		GROUP BY b.business_id
		ORDER BY common_tip_count DESC
		LIMIT 10
		", $vArgs['business_id']);
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fAddToGo(
	$vArgs
) 
{
	global $kDbSuccess, $kDbError;
	
	if (fDbAddToGo($vArgs)) {
		return array(
			'errno' => $kDbSuccess,
		);
	}
	
	return array(
		'errno' => $kDbError
	);
}

//-----------------------------------------------------------------------------------------
function fDbAddToGo(
	$vArgs
) 
{
	global $vConn;
	
	$time = time();
	
	$q = sprintf("
		INSERT INTO tblYMToGo
		SET
			ym_user_id = %d,
			business_id = '%s',
			timestamp = %d
		ON DUPLICATE KEY 
		UPDATE
			timestamp = %d", $vArgs['ym_user_id'], $vArgs['business_id'], $time, $time);
	
	return mysqli_query($vConn, $q);	
}

//-----------------------------------------------------------------------------------------
function fGetStatistics(
	$vArgs
)
{
	global $kDbSuccess;
	
	return array(
        'errno' => $kDbSuccess,
        'data' => array(
            'review_count_by_month' => fGetDbReviewCountByMonth($vArgs),
			'tip_count_by_month' => fGetDbTipCountByMonth($vArgs)
        )
    );
}

//-----------------------------------------------------------------------------------------
function fGetDbReviewCountByMonth(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT YEAR(`date`) AS `year`, MONTH(`date`) AS `month`, COUNT(*) count
		FROM tblReview
		WHERE business_id = '%s'
		GROUP BY `year`, `month`
		ORDER BY `year`, `month`", $vArgs['business_id']);
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fGetDbTipCountByMonth(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT YEAR(`date`) AS `year`, MONTH(`date`) AS `month`, COUNT(*) count
		FROM tblTip
		WHERE business_id = '%s'
		GROUP BY `year`, `month`
		ORDER BY `year`, `month`", $vArgs['business_id']);
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}
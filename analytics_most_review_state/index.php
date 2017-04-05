<?php
require_once '../common/php/const.php';
require_once '../common/php/util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

switch ($_GET['cmd']) {
	case 'get_top_review_state':
		echo json_encode(fGetTopReviewState($_GET));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
}

//------------------------------------------------------------------------------
function fGetTopReviewState(
	$vArgs
) {
	global $kDbSuccess, $kDbError;
	
	$vCategories = fDbGetTopReviewState();
	
    return array(
        'errno' => $kDbSuccess,
        'data' => array(
			'categories' => $vCategories
        )
    );

    err:
    return array('errno' => $kDbError);
}

//-----------------------------------------------------------------------------------------
function fDbGetTopReviewState(
)
{
	global $vConn;

	// Original query, take a few minutes to run
//	$q = "
//		SELECT *
//		FROM
//		(SELECT 'Health' AS category, b.state, COUNT(*) AS state_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND b.categories LIKE '%Health & Medical%' 
//			AND b.categories NOT LIKE '%Beauty & Spas%'
//			AND b.state != ''
//		GROUP BY category, b.state
//		ORDER BY state_review_count DESC
//		LIMIT 1) a
//		JOIN 
//		(SELECT COUNT(*) AS total_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND b.categories LIKE '%Health & Medical%' 
//			AND b.categories NOT LIKE '%Beauty & Spas%'
//			AND b.state != '') b
//
//		
//		UNION
//
//		SELECT *
//		FROM
//		(SELECT 'Beauty and Fitness' AS category, b.state, COUNT(*) AS state_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Beauty & Spas%' OR b.categories LIKE '%Active Life%')
//			AND b.categories NOT LIKE '%Health & Medical%'
//			AND b.state != ''
//		GROUP BY category, b.state
//		ORDER BY state_review_count DESC
//		LIMIT 1) a
//		JOIN 
//		(SELECT COUNT(*) AS total_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Beauty & Spas%' OR b.categories LIKE '%Active Life%')
//			AND b.categories NOT LIKE '%Health & Medical%'
//			AND b.state != '') b
//			
//		
//		UNION
//		
//		SELECT *
//		FROM
//		(SELECT 'Night Life' AS category, b.state, COUNT(*) AS state_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Night Life%' OR b.categories LIKE '%Bars%') 
//			AND b.categories not LIKE '%Restaurants%'
//			AND b.state != ''
//		GROUP BY category, b.state
//		ORDER BY state_review_count DESC
//		LIMIT 1) a
//		JOIN 
//		(SELECT COUNT(*) AS total_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Night Life%' OR b.categories LIKE '%Bars%') 
//			AND b.categories not LIKE '%Restaurants%'
//			AND b.state != '') b
//			
//		
//		UNION
//		
//
//		SELECT *
//		FROM
//		(SELECT 'Shopping' AS category, b.state, COUNT(*) AS state_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND b.categories LIKE '%Shopping%'
//			AND b.state != ''
//		GROUP BY category, b.state
//		ORDER BY state_review_count DESC
//		LIMIT 1) a
//		JOIN 
//		(SELECT COUNT(*) AS total_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND b.categories LIKE '%Shopping%'
//			AND b.state != '') b
//
//
//		UNION
//		
//		SELECT *
//		FROM
//		(SELECT 'Shopping' AS category, b.state, COUNT(*) AS state_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND b.categories LIKE '%Shopping%'
//			AND b.state != ''
//		GROUP BY category, b.state
//		ORDER BY state_review_count DESC
//		LIMIT 1) a
//		JOIN 
//		(SELECT COUNT(*) AS total_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND b.categories LIKE '%Shopping%'
//			AND b.state != '') b
//			
//		
//		UNION
//		
//		SELECT *
//		FROM
//		(SELECT 'Apartments' AS category, b.state, COUNT(*) AS state_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Apartments%' OR b.categories like '%Real Estates%')
//			AND b.state != ''
//		GROUP BY category, b.state
//		ORDER BY state_review_count DESC
//		LIMIT 1) a
//		JOIN 
//		(SELECT COUNT(*) AS total_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Apartments%' OR b.categories like '%Real Estates%')
//			AND b.state != '') b
//			
//		
//		UNION
//
//		SELECT *
//		FROM
//		(SELECT 'Entertainments' AS category, b.state, COUNT(*) AS state_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Arts & Entertainment%')
//			AND b.state != ''
//		GROUP BY category, b.state
//		ORDER BY state_review_count DESC
//		LIMIT 1) a
//		JOIN 
//		(SELECT COUNT(*) AS total_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Arts & Entertainment%')
//			AND b.state != '') b
//		
//
//		UNION
//
//		SELECT *
//		FROM
//		(SELECT 'Entertainments' AS category, b.state, COUNT(*) AS state_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Arts & Entertainment%')
//			AND b.state != ''
//		GROUP BY category, b.state
//		ORDER BY state_review_count DESC
//		LIMIT 1) a
//		JOIN 
//		(SELECT COUNT(*) AS total_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Arts & Entertainment%')
//			AND b.state != '') b
//		
//			
//		UNION
//		
//		SELECT *
//		FROM
//		(SELECT 'Restaurants' AS category, b.state, COUNT(*) AS state_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Restaurants%' OR b.categories like '%Food%')
//			AND b.state != ''
//		GROUP BY category, b.state
//		ORDER BY state_review_count DESC
//		LIMIT 1) a
//		JOIN 
//		(SELECT COUNT(*) AS total_review_count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND (b.categories LIKE '%Restaurants%' OR b.categories like '%Food%')
//			AND b.state != '') b
//	";
	
	$q = "
		SELECT clustered_category AS category, state, state_review_count, total_review_count
		FROM cacheTopStates
	";
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}
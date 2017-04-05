<?php
require_once '../common/php/const.php';
require_once '../common/php/util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

switch ($_GET['cmd']) {
	case 'get_coolest_business':
		echo json_encode(fGetCoolestBusinessPerClusteredCategory($_GET));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
}

//------------------------------------------------------------------------------
function fGetCoolestBusinessPerClusteredCategory(
	$vArgs
) {
	global $kDbSuccess, $kDbError;
	
	$vCategories = fGetDbCoolestBusinessPerClusteredCategory();
	
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
function fGetDbCoolestBusinessPerClusteredCategory(
)
{
	global $vConn;

	// Original query, take a few minutes to run
//	$q = "
//		SELECT 'Health' AS category, COUNT(*) AS count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND r.`vote.cool` > 0
//			AND b.categories LIKE '%Health & Medical%' 
//			AND b.categories NOT LIKE '%Beauty & Spas%'
//		
//		UNION
//		
//		SELECT 'Beauty and Fitness' AS category, COUNT(*) AS count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND r.`vote.cool` > 0
//			AND (b.categories LIKE '%Beauty & Spas%' OR b.categories LIKE '%Active Life%')
//			AND b.categories NOT LIKE '%Health & Medical%'
//		
//		UNION
//		
//		SELECT 'Night Life' AS category, COUNT(*) AS count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND r.`vote.cool` > 0
//			AND (b.categories LIKE '%Night Life%' OR b.categories LIKE '%Bars%') 
//			AND b.categories not LIKE '%Restaurants%'
//		
//		UNION
//		
//		SELECT 'Shopping' AS category, COUNT(*) AS count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND r.`vote.cool` > 0
//			AND b.categories LIKE '%Shopping%'
//		UNION 
//		
//		SELECT 'Apartments' AS category, COUNT(*) AS count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND r.`vote.cool` > 0
//			AND (b.categories LIKE '%Apartments%' OR b.categories like '%Real Estates%')
//		
//		UNION
//		
//		SELECT 'Entertainments' AS category, COUNT(*) AS count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND r.`vote.cool` > 0
//			AND (b.categories LIKE '%Arts & Entertainment%')
//		
//		UNION
//		
//		SELECT 'Restaurants' AS category, COUNT(*) AS count
//		FROM tblReview r, tblBusiness b
//		WHERE b.business_id = r.business_id 
//			AND r.`vote.cool` > 0
//			AND (b.categories LIKE '%Restaurants%' OR b.categories like '%Food%')
//	";
	
	$q = "
		SELECT clustered_category AS category, count
		FROM cacheCoolest
		ORDER BY count DESC";
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}
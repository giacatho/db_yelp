<?php
require_once '../common/php/const.php';
require_once '../common/php/util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

//------------------------------------------------------------------------------
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
	
	$vTopCategories = fDbGetTopCategory();
	
	$vTopBusinessesByCategory = array();
	foreach ($vTopCategories as $vCategory) {
		$vCategoryName = $vCategory['category'];
		
		$vTopBusinessesByCategory[$vCategoryName] = fDbGetTopBusinessesByCategory($vCategoryName);
	}
	
    return array(
        'errno' => $kDbSuccess,
        'data' => array(
            'top_businesses_by_category' => $vTopBusinessesByCategory
        )
    );

    err:
    return array('errno' => $kDbError);
}

//-----------------------------------------------------------------------------------------
function fDbGetTopCategory(
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT category 
		From tblBusinessCategory 
		GROUP BY category 
		HAVING COUNT(business_id) > 1000
		ORDER BY COUNT(business_id) DESC
		LIMIT 10
	");
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fDbGetTopBusinessesByCategory(
	$vCategory
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT a.business_id, a.name, a.full_address, a.stars, 
			a.review_count, a.categories, 
			a.latitude, a.longitude 
		FROM tblBusiness a
			JOIN tblBusinessCategory b
		WHERE a.business_id = b.business_id 
			AND b.category = '%s'
			AND a.stars > 3.5 
			AND a.`open` = 'TRUE'  
		ORDER BY a.stars DESC, a.review_count DESC, a.name 
		LIMIT 5", $vCategory);
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

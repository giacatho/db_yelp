<?php
require_once '../common/php/const.php';
require_once '../common/php/util.php';

//------------------------------------------------------------------------------
$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);
// Got UTF8 problem with result, http://stackoverflow.com/a/15183835/1343667
mysqli_set_charset($vConn, "utf8");

//------------------------------------------------------------------------------
switch ($_POST['cmd']) {
	case 'get_dynamic_filters':
		echo json_encode(fGetDynamicFilters($_POST));
		break;
	
	case 'get_data':
		echo json_encode(fGetData($_POST));
		break;
	
	default:
		echo json_encode(array (
			'errno' => 'no_cmd'
		));
}

//-----------------------------------------------------------------------------------------
function fGetDynamicFilters(
    $vArgs
)
{
    global $kDbSuccess;
    
    return array(
        'errno' => $kDbSuccess,
        'categories' => fDbGetTopCategories(),
		'cities' => fDbGetCities()
    );
}

//------------------------------------------------------------------------------
function fGetData(
	$vArgs
) {
	global $kDbSuccess, $kDbError;
	
	$vBusinesses = fDbSearchBusiness($vArgs);
	
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
function fGetOrderByString (
	$vArgs
)
{
	if ($vArgs['search']['order_by'] == '')
		return ' a.stars DESC, a.name ';
	
	if ($vArgs['search']['order_by'] == 'stars' || $vArgs['search']['order_by'] == 'review_count') 
		return ' a.' . $vArgs['search']['order_by'] . ' DESC ';
	
	return ' a.name ';
}

//-----------------------------------------------------------------------------------------
function fGetWhereString (
	$vArgs
)
{
	$vWhere = " 1 = 1 ";
	
	if ($vArgs['search']['term'] != '') {
		$vWhere .= " AND a.name LIKE '%" .  $vArgs['search']['term'] . "%' ";
	}
	
	if ($vArgs['search']['category'] != '') {
		// Can use join in the main query, but that way needs the expensive DISTINCT
		$vWhere .= " AND a.business_id IN (
			SELECT b.business_id 
			FROM tblBusinessCategory b
			WHERE b.category = '" .  $vArgs['search']['category'] . "') ";
	}
	
	if ($vArgs['search']['state'] != '') {
		$vWhere .= "AND a.state ='" . $vArgs['search']['state'] ."' ";
	}
	
	if ($vArgs['search']['city'] != '') {
		$vWhere .= "AND a.city ='" . $vArgs['search']['city'] ."' ";
	}
	
	return $vWhere;
}

//-----------------------------------------------------------------------------------------
function fDbSearchBusiness(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT a.business_id, a.name, a.full_address, a.stars, 
			a.review_count, a.categories, 
			a.latitude, a.longitude 
		FROM tblBusiness a
		WHERE %s
		ORDER BY %s
		LIMIT %d, %d", 
			fGetWhereString($vArgs),
			fGetOrderByString($vArgs),
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
		ORDER BY state, city");
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

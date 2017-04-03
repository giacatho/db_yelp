<?php
require_once '../const.php';
require_once '../util.php';

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
	
    return array(
        'errno' => $kDbSuccess,
        'data' => array(
            'weekly_trends' => fDbGetWeeklyTrends($vArgs),
			'monthly_trends' => fDbGetMonthlyTrends($vArgs)
        )
    );

    err:
    return array('errno' => $kDbError);
}

//-----------------------------------------------------------------------------------------
function fDbGetWeeklyTrends(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT b.business_id, b.name, b.full_address, b.stars,
			COUNT(*) AS action_count, b.categories, 
			b.latitude, b.longitude  
		FROM (
			SELECT business_id, user_id,`date`
			FROM tblTip
			WHERE `date` > DATE_SUB(DATE('2016-08-02 00:00:00'), INTERVAL 1 week)
		) a
		JOIN tblBusiness b
			ON a.business_id = b.business_id
		GROUP BY a.business_id
		ORDER BY action_count DESC
		LIMIT 10");
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fDbGetMonthlyTrends(
	$vArgs
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT b.business_id, b.name, b.full_address, b.stars,
			COUNT(*) AS action_count, b.categories, 
			b.latitude, b.longitude  
		FROM (
			SELECT business_id, user_id,`date`
			FROM tblTip
			WHERE `date` > DATE_SUB(DATE('2016-08-02 00:00:00'), INTERVAL 1 month)
		) a
		JOIN tblBusiness b
			ON a.business_id = b.business_id
		GROUP BY a.business_id
		ORDER BY action_count DESC
		LIMIT 10");
	
	$result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}
<?php
ini_set('display_errors', 1);
require_once '../common/php/const.php';
require_once '../common/php/util.php';

$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);

$startTS = time();

if (!fInitCategoryTables())
	exit("Something wrong with the database.");

$businesses = fDbGetAllBusinessWithCategory();

$counter = 0;
foreach ($businesses as $business) {
	set_time_limit(10);
	//print_r($business);
	$catStr = $business['categories'];

	$categories = explode(",", substr($catStr, 1, strlen($catStr) - 2));
	
	foreach ($categories as $yCategory) {
		$category = getRealText($yCategory);
		if ($category != '') {
			fDbInsertCategory($category);
			fDbInsertBusinessCategory($business['business_id'], $category);
		}
	}
	$counter++;
	
	if ($counter % 100000 == 0) echo '.';
}

$endTS = time();
echo 'Done! Take ' . gmdate("H:i:s", $endTS - $startTS);

//-----------------------------------------------------------------------------------------
function fInitCategoryTables() {
	global $vConn;

    $q = sprintf("DROP TABLE IF EXISTS tblCategory");
	if (!mysqli_query($vConn, $q))
		return false;
	
	$q = sprintf("CREATE TABLE tblCategory (
					category VARCHAR(50) NOT NULL,
					PRIMARY KEY(category)
				)");
	if (!mysqli_query($vConn, $q)) 
		return false;
	
	$q = sprintf("DROP TABLE IF EXISTS tblBusinessCategory");
	if (!mysqli_query($vConn, $q))
		return false;
	
	$q = sprintf("CREATE TABLE tblBusinessCategory (
					business_id VARCHAR(50) NOT NULL, 
					category VARCHAR(50) NOT NULL,
					PRIMARY KEY(business_id, category)
				)");
	if (!mysqli_query($vConn, $q)) 
		return false;
	
	return true;
}

//-----------------------------------------------------------------------------------------
function fDbInsertCategory(
    $vCategory
)
{
    global $vConn;
    
    $q = sprintf("INSERT INTO tblCategory
        SET category = '%s' 
		ON DUPLICATE KEY UPDATE category=category", $vCategory);
    
    return mysqli_query($vConn, $q);
}

//-----------------------------------------------------------------------------------------
function fDbInsertBusinessCategory(
    $vBusinessId,
	$vCategory
)
{
    global $vConn;
    
    $q = sprintf("INSERT INTO tblBusinessCategory
        SET business_id = '%s', category = '%s' 
		ON DUPLICATE KEY UPDATE business_id=business_id, category=category", 
			$vBusinessId, $vCategory);
    
    return mysqli_query($vConn, $q);
}

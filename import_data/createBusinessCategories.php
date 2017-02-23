<?php
require_once './../const.php';
require_once './../util.php';

$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);

$startTS = time();

if (!fInitCategoryTables())
	exit("Something wrong with the database.");

$businesses = fDbGetAllBusinessWithCategory();

$count = 0;
foreach ($businesses as $business) {
	set_time_limit(10);
	//print_r($business);
	$catStr = $business['categories'];

	$categories = explode(",", substr($catStr, 1, strlen($catStr) - 2));
	
	foreach ($categories as $yCategory) {
		$category = getRealText($yCategory);
		fDbInsertCategory($category);
		fDbInsertBusinessCategory($business['business_id'], $category);
	}
	$counter++;
	
	if ($count % 100000 == 0) echo '.';
}

$endTS = time();
echo 'Done! Take ' . gmdate("H:i:s", $endTS - $startTS);
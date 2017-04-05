<?php
ini_set('display_errors', 1);
require_once '../common/php/const.php';
require_once '../common/php/util.php';

$vConn = mysqli_connect($kDbHost, $kDbUser,	$kDbPassword, $kDbDatabase);

$startTS = time();

if (!fInitFiendsTables())
	exit("Something wrong with the database.");

$users = fDbGetAllUserWithFriend();

$counter = 0;
foreach ($users as $user) {
	set_time_limit(10);
	// print_r($friend);
	$friendStr = $user['friends'];

	$friends = explode(",", substr($friendStr, 1, strlen($friendStr) - 2));
	
	foreach ($friends as $yFriendId) {
		//echo $yFriendId . '   ';
		$friendId = getRealText($yFriendId);
		if ($friendId != '') {
			fDbInsertUserFriend($user['user_id'], $friendId);
		}
	}
	$counter++;
	
	if ($counter % 100000 == 0) echo '.';
}

$endTS = time();
echo 'Done! Take ' . gmdate("H:i:s", $endTS - $startTS);


//-----------------------------------------------------------------------------------------
function fInitFiendsTables() {
	global $vConn;

	$q = sprintf("DROP TABLE IF EXISTS tblFriend");
	if (!mysqli_query($vConn, $q))
		return false;
	
	$q = sprintf("CREATE TABLE tblFriend (
					user_id VARCHAR(50) NOT NULL, 
					friend_id VARCHAR(50) NOT NULL,
					PRIMARY KEY(user_id, friend_id)
				)");
	if (!mysqli_query($vConn, $q)) 
		return false;
	
	return true;
}

//-----------------------------------------------------------------------------------------
function fDbInsertUserFriend(
    $vUserId,
	$vFriendId
)
{
    global $vConn;
    
    $q = sprintf("INSERT INTO tblFriend
        SET user_id = '%s', friend_id = '%s' 
		ON DUPLICATE KEY UPDATE user_id=user_id, friend_id=friend_id", 
			$vUserId, $vFriendId);
    
    return mysqli_query($vConn, $q);
}

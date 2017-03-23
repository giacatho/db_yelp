<?php
///////////////////////// Database ////////////////////////////////////////////////////////
//-----------------------------------------------------------------------------------------
function fDbGrabDb($result)
{
    $data = array();

    while ($row = mysqli_fetch_assoc($result))
        array_push($data, $row);

    return $data;
}

//-----------------------------------------------------------------------------------------
function fDbGetUserByEmail(
	$vEmail
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT * 
		FROM tblYMUser
		WHERE email = '%s'", $vEmail);
	
	$res = mysqli_query($vConn, $q);
	
	if (count($res) == 0)
		return null;
	
	return mysqli_fetch_assoc($res);
}


/************************************************************************************
  Version4 UUIDs (pseudo-random)
************************************************************************************/
function uuid()
{
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff));
}

//-----------------------------------------------------------------------------------------
function getRealText($yelpText) {
	// Yelp text: u'Grocery'
	$trimmedYelpText = trim($yelpText);
	
	return substr($trimmedYelpText, 2, strlen($trimmedYelpText)-3);
}

//-----------------------------------------------------------------------------------------
function jsonIfError() {
	switch (json_last_error()) {
		case JSON_ERROR_DEPTH:
			echo ' - Maximum stack depth exceeded';
			break;
		case JSON_ERROR_STATE_MISMATCH:
			echo ' - Underflow or the modes mismatch';
			break;
		case JSON_ERROR_CTRL_CHAR:
			echo ' - Unexpected control character found';
			break;
		case JSON_ERROR_SYNTAX:
			echo ' - Syntax error, malformed JSON';
			break;
		case JSON_ERROR_UTF8:
			echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
			break;
		default:
			echo ' - Unknown error';
			break;
	}
}

//-----------------------------------------------------------------------------------------
function fSessionWall(
	&$vArgs
)
{
	$vSession = fDbGetSession($vArgs['session_id']);
	
	if ($vSession == null)
		return false;
	
	$vArgs['ym_user_id'] = $vSession['ym_user_id'];

	return true;
}

//----------------------------------------------------------------------------------------
function fDbGetSession(
	$vSessionId
)
{
	global $vConn;
	
	$q = sprintf("
		SELECT * 
		FROM tblYMSession
		WHERE session_id = '%s'", $vSessionId);
	
	$res = mysqli_query($vConn, $q);
	
	if (count($res) == 0)
		return null;
	
	return mysqli_fetch_assoc($res);
}
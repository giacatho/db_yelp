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


//-----------------------------------------------------------------------------------------
function fDbGetAllBusinessWithCategory(
)
{
    global $vConn;

    $q = sprintf("SELECT business_id, categories FROM tblBusiness");

    $result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fDbGetAllUserWithFriend(
)
{
    global $vConn;

    $q = sprintf("SELECT user_id, friends FROM tblUser");

    $result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

//-----------------------------------------------------------------------------------------
function fDbGetMIFUnitFromDescAndGrade(
    $vDesc,
    $vGradeId,
	$vIsMIF
)
{
    global $vConn;

	if ($vIsMIF)
		$q = sprintf("SELECT * FROM tbl_book_units
			WHERE full_desc = '%s' AND grade_id = %d AND pm_bookunitid IS NULL", $vDesc, $vGradeId);
	else
		$q = sprintf("SELECT * FROM tbl_book_units
			WHERE full_desc = '%s' AND grade_id = %d AND pm_bookunitid IS NOT NULL", $vDesc, $vGradeId);

    $result = mysqli_query($vConn, $q);
	
	if (count($result) != 1)
		return null;

    return mysqli_fetch_assoc($result);
}

//-----------------------------------------------------------------------------------------
function fDbInsertQuestion(
    $vArgs
)
{
    global $vConn;
    
    $ts = time();

    $q = sprintf("INSERT INTO tbl_questions
        SET subject_id = 200,
            content_id = %d,
            grade_id = %d,
            learnosity_item_id = '%s',
            description = '%s',
            ccss_standard = '%s',
            mif_lesson = '%s',
            pm_lesson = '%s',
            timestamp = %d", 
            $vArgs['content_id'],
            $vArgs['grade_id'], 
            $vArgs['learnosity_item_id'],
            $vArgs['description'],
            $vArgs['ccss_standard'],
            $vArgs['mif_lesson'],
            $vArgs['pm_lesson'],
            $ts);
    
    return mysqli_query($vConn, $q);
}

//-----------------------------------------------------------------------------------------
function fDbAssocTestWithQtns(
    $vTestId,
    $vQtnId,
    $vOrder
)
{
    global $vConn;

    $q = sprintf("INSERT INTO tbl_test_qtns
    SET test_id = %d, qtn_id = %d, _order = %d, visible = 1",
        $vTestId, $vQtnId, $vOrder);

    echo $q . "<br/>";

    return mysqli_query($vConn, $q);
}

// Utilities ------
function getRealText($yelpText) {
	// Yelp text: u'Grocery'
	$trimmedYelpText = trim($yelpText);
	
	return substr($trimmedYelpText, 2, strlen($trimmedYelpText)-3);
}

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
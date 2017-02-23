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
function fDbGetAllBusinessWithCategory(
)
{
    global $vConn;

    $q = sprintf("SELECT business_id, categories FROM tblBusiness");

    $result = mysqli_query($vConn, $q);

    return fDbGrabDb($result);
}

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
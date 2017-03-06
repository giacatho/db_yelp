//-----------------------------------------------------------------------------------------
function fDropGet(vId)
{
    var vNode, vData;

    vData = {};

    vNode = $('#' + vId).find('.selection');
    vData.text = vNode.text();
    vData.key = vNode.attr('key');

    return vData;
}

//-----------------------------------------------------------------------------------------
function fDropPick(vObj)
{
    var i, vNode, vSelect;

    vSelect = null;

    if (vObj.pos !== undefined)
        vSelect = $('#' + vObj.id).find('.dropdown-menu li a').eq(vObj.pos);
    else if (vObj.key !== undefined)
    {
        for (i = 0; ; i++)
        {
            vSelect = $('#' + vObj.id).find('.dropdown-menu li a').eq(i);
            if (vSelect.length == 0)
                return;
            if (vSelect.attr('key') == vObj.key)
                break;
        }
    }

    if (vSelect)
    {
        vNode = $('#' + vObj.id).find('.selection');
        vNode.text(vSelect.text());
        vNode.attr('key', vSelect.attr('key'));
    }
}

//-----------------------------------------------------------------------------------------
function fDropFill(vObj)
{
    var i, vItem, vBody;

    vBody = '';

    i = vObj.skip_default ? 1 : 0;
    for (; i < vObj.data.length; i++)
    {
        vItem = vObj.data[i];

        if (vItem.text == '')
            vBody += "<li class='divider'></li>";
        else
        {
            vBody += "<li><a key='" +
            vItem.key + "' href='#'>" +
            vItem.text + "</a></li>";
        }
    }

    if (vObj.data.length)
    {
        $('#' + vObj.id).find('.selection').html(vObj.data[0].text)
            .attr('key', vObj.data[0].key);
        $('#' + vObj.id).find('.dropdown-menu').html(vBody);
    }
}

//-----------------------------------------------------------------------------------------
function fCreateGenericDrop(
    vDrop
)
{
    var i, o;

    o = {id: vDrop.id, data: []};
    if (! vDrop.default_key)
        vDrop.default_key = 0;

    if (vDrop.default_text)
    {
        o.data = [
            {key: vDrop.default_key, text: vDrop.default_text},
            {key: vDrop.default_key, text: ''}
        ];
    }

    for (i = 0; i < vDrop.data.length; i++)
        o.data.push(vDrop.data[i]);

    fDropFill(o);
}

//-----------------------------------------------------------------------------------------
function fCreateAllSubjectsDrop(
    vId,
    vDefault
)
{
    var vKey, o;

    o = {
        id: vId,
        data: [
            {key: 0, text: vDefault},
            {key: 0, text: ''}
        ]
    };

    for (vKey in g.strs.kSubjects)
    {
        o.data.push({
            key: vKey,
            text: g.strs.kSubjects[vKey]
        });
    }

    fDropFill(o);
}

//-----------------------------------------------------------------------------------------
function fCreateAllGradesDrop (
    vId,
    vDefault
)
{
    fCreateAllGradesDropCommon(vId, vDefault, g.strs.kGrades);
}
//-----------------------------------------------------------------------------------------
// vList: list of objects which have syllabus_code as one of the properties
//-----------------------------------------------------------------------------------------
function fGrabSyllabusCodes(
    vList,
    vCodes
)
{
    var i, j, o, vMulti, vSyllabus;

    for (var i = 0; i < vList.length; i++)
    {
        o = vList[i];
        o.syllabus_code = fTrim(o.syllabus_code);

        if (fTrim(o.syllabus_code) == '')
            continue;

        vMulti = o.syllabus_code.split(',');
        for (j = 0; j < vMulti.length; j++)
        {
            vSyllabus = fTrim(vMulti[j]);
            if (!fFindInArray(vCodes, 'key', vSyllabus))
            {
                vCodes.push({
                    key: vSyllabus,
                    text: vSyllabus
                });
            }
        }
    }
}

//-----------------------------------------------------------------------------------------
function fGrabDistinctValues(
    vList,
    vToSortedArr,
    vProp
)
{
    var i, j, o, vVal, vMulti, vSingle;
    for (i=0; i<vList.length; i++)
    {
        o = vList[i];
        vVal = fTrim(o[vProp]);
        
        if (vVal == '') 
            continue;
        
        vMulti = vVal.split('/');
        for (j=0; j<vMulti.length; j++)
        {
            vSingle = fTrim(vMulti[j]);
            if (!fFindInArray(vToSortedArr, 'key', vSingle))
            {
                vToSortedArr.push({
                    key: vSingle,
                    text: vSingle
                });
            }
        }
    }
    
    vToSortedArr.sort(fCompare);
}

//-----------------------------------------------------------------------------------------
function fCompare(a,b) {
    if (a.text < b.text)
        return -1;
    if (a.text > b.text)
        return 1;
    return 0;
}

//-----------------------------------------------------------------------------------------
function fCreateDropCCSSClusters(
    vList
)
{
    var vToArr;
    vToArr = [];
    fGrabDistinctValues(vList, vToArr, 'ccss_cluster');
    
    fCreateGenericDrop({
        id: 'drop_ccss_cluster',
        default_text: g.strs.kUIStrings['ksAllCCSSClusters'],
        data: vToArr
    });
}

//-----------------------------------------------------------------------------------------
function fCreateDropCategories(
	vList
)
{
	var vToArr;
    vToArr = [];
    fGrabDistinctValues(vList, vToArr, 'category');
	
	fCreateGenericDrop({
        id: 'drop_category',
        default_text: 'All Categories',
        data: vToArr
    });
}
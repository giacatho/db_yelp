//-----------------------------------------------------------------------------------------
// Place generic helper functions here. Helper functions that can be used for any
// web applications.
//-----------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------
function fCloneArray(vArr)
{
    var i, v, a = [];

    for (i = 0; i < vArr.length; i++)
    {
        v = vArr[i];

        if (v instanceof Array)
            a.push(fCloneArray(v));
        else if (v instanceof Object)
            a.push(fCloneObject(v));
        else
            a.push(v);
    }

    return a;
}

//-----------------------------------------------------------------------------------------
function fCloneObject(
    vObj,
    vMask
)
{
    var i, o = {}, v, vKey;

    for (vKey in vObj)
    {
        for (i = 0; vMask && i < vMask.length; i++)
            if (vKey == vMask[i])
                continue;

        v = vObj[vKey];
        if (v instanceof Array)
            o[vKey] = fCloneArray(v);
        else if (v instanceof Object)
            o[vKey] = fCloneObject(v);
        else
            o[vKey] = v;
    }

    return o;
}

//-----------------------------------------------------------------------------------------
function fStopBubble(e)
{
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
}

//-----------------------------------------------------------------------------------------
function fActivityPopup(vUrl)
{
    window.open(vUrl, "mco-window", "height=768, width=1024");
}

//-----------------------------------------------------------------------------------------
// hour interval
// @param t1 Unix Timestamp
// @param t2 Unix Timestamp
// @return hours: hours==0 is the same time, hours>0 mean t1>t2, hours<0 mean t1<t2,
// 1 mean 0 to 60 minutes.
//-----------------------------------------------------------------------------------------
function fGetHourInterval(
    t1,
    t2
)
{
    var vHourSec, vHs;

    vHourSec = 60 * 60;
    vHs = (t1 - t2) / vHourSec;

    return t1 > t2 ? Math.ceil(vHs) : Math.floor(vHs);
}

//-----------------------------------------------------------------------------------------
// Note: When using timestamp, JS takes care of the timezone
//-----------------------------------------------------------------------------------------
function fTimestampToDate(vTimestamp)
{
    var vDate, vDay, vMonth, vYear;

    vTimestamp = parseInt(vTimestamp);
    vDate = new Date(vTimestamp * 1000);

    vDay = vDate.getDate();
    vMonth = vDate.getMonth();
    vYear = vDate.getFullYear();

    return vDay + ' ' + fMonthName(vMonth) + ' ' + vYear;
}

//-----------------------------------------------------------------------------------------
function fTimestampToUTCDate(vTimestamp)
{
    var vDate, vDay, vMonth, vYear;

    vTimestamp = parseInt(vTimestamp);
    vDate = new Date(vTimestamp * 1000);

    vDay = vDate.getUTCDate();
    vMonth = vDate.getUTCMonth();
    vYear = vDate.getUTCFullYear();

    return fToDateString(vDay, vMonth, vYear);
}

//-----------------------------------------------------------------------------------------
function fToDateString(vDay, vMonth, vYear)
{
    return vDay + ' ' + fMonthName(vMonth) + ' ' + vYear;
}

//-----------------------------------------------------------------------------------------
function fTimestampToDateObj(vTimestamp)
{
    vTimestamp = parseInt(vTimestamp);
    return new Date(vTimestamp * 1000);
}

//-----------------------------------------------------------------------------------------
// Note: When using timestamp, JS takes care of the timezone
//-----------------------------------------------------------------------------------------
function fTimestampToTime(vTimestamp)
{
    var d;

    vTimestamp = parseInt(vTimestamp);

    d = new Date(vTimestamp * 1000);
    
    return fToTimeStr(d.getHours(), d.getMinutes());    
}

//-----------------------------------------------------------------------------------------
function fTimestampToUTCTime(vTimestamp)
{
    var d;

    vTimestamp = parseInt(vTimestamp);

    d = new Date(vTimestamp * 1000);
    
    return fToTimeStr(d.getUTCHours(), d.getUTCMinutes());   
}

//-----------------------------------------------------------------------------------------
function fToTimeStr(v24Hour, vMin)
{
    var v12Hour, isAM;
    
    if (v24Hour === 0)
    {
        v12Hour = 12;
        isAM = true;
    }
    else if (v24Hour < 12)
    {
        v12Hour = v24Hour;
        isAM = true;
    }
    else if (v24Hour === 12)
    {
        v12Hour = 12;
        isAM = false;
    }
    else
    {
        v12Hour = v24Hour % 12;
        isAM = false;
    }

    if (String(vMin).length < 2)
        vMin = '0' + vMin;

    return v12Hour + ":" + vMin + (isAM ? ' AM' : ' PM');
}

//-----------------------------------------------------------------------------------------
// Note: When using timestamp, JS takes care of the timezone.
//-----------------------------------------------------------------------------------------
function fDateToTimestamp(vDate)
{
    return Math.floor(vDate.getTime() / 1000);
}

//-----------------------------------------------------------------------------------------
// Note: This is timezone independent. UTC time is based on 1 Jan 1970. So, a timestamp
// can also be said to "follow UTC time".
//-----------------------------------------------------------------------------------------
function fUnixTimestampNow()
{
    // this always give the unix timestamp (same as time() in PHP).
    return Math.floor(new Date().getTime() / 1000);
}

//-----------------------------------------------------------------------------------------
function fMonthName(n)
{
    var vMonths = [
        'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'
    ];

    return vMonths[n];
}

//-----------------------------------------------------------------------------------------
function fBindPageUnloadEvent()
{
    if (navigator.appName == 'Microsoft Internet Explorer')
        window.attachEvent("onunload", fOnPageUnload);
    else
        window.addEventListener("beforeunload", fOnPageUnload, false);
}

//-----------------------------------------------------------------------------------------
function fInitContext()
{
    try
    {
        return JSON.parse(localStorage[document.domain]);
    }
    catch (e)
    {
    }

    return null;
}

//-----------------------------------------------------------------------------------------
function fUpdateContext(
    vKey,
    vObj
)
{
    var o;

	if (!(document.domain in localStorage))
		o = {}
	else
		o = JSON.parse(localStorage[document.domain]);
	
	o[vKey] = fCloneObject(vObj);

    localStorage[document.domain] = JSON.stringify(o);
	
    return true;
}

//-----------------------------------------------------------------------------------------
function fGoto(vUrl)
{
    window.location = vUrl;
}

//-----------------------------------------------------------------------------------------
function fCountKeysInObject(o)
{
    var vKey, vLen;

    vLen = 0;
    for (vKey in o)
        vLen++;

    return vLen;
}

//-----------------------------------------------------------------------------------------
function fListToHash(
    vList,
    vKey
)
{
    var i, o, vGroup, vHash = {};

    for (i = 0; i < vList.length; i++)
    {
        if (!(o = vList[i]))
            continue;

        vGroup = o[vKey];
        vHash[vGroup] = vHash[vGroup] || [];
        vHash[vGroup].push(o);
    }

    return vHash;
}

//-----------------------------------------------------------------------------------------
function fGetPosInArray(
    vList,
    vKey,
    vValue
)
{
    var i, o;

    for (i = 0; i < vList.length; i++)
    {
        if (!(o = vList[i]))
            continue;

        if (o[vKey] == vValue)
            return i;
    }

    return null;
}

//-----------------------------------------------------------------------------------------
function fGetUniquesInArray(
    vList,
    vKey
)
{
    var i, o, vUnique, vUniqueList;

    vUnique = {};
    vUniqueList = [];

    for (i = 0; i < vList.length; i++)
    {
        if (!(o = vList[i]))
            continue;

        if (vUnique[o[vKey]])
            continue;

        vUnique[o[vKey]] = true;
        vUniqueList.push(o);
    }

    return vUniqueList;
}

//-----------------------------------------------------------------------------------------
function fFindInArray(
    vList,
    vKey,
    vValue,
    vKey2,
    vValue2
)
{
    var i, o;

    for (i = 0; i < vList.length; i++)
    {
        if (!(o = vList[i]))
            continue;

        if ((vKey2 && (o[vKey] == vValue && o[vKey2] == vValue2)) ||
            (!vKey2 && (o[vKey] == vValue)))
        {
            return o;
        }
    }
    return null;
}

//-----------------------------------------------------------------------------------------
function fFindInArrayList(
    vList,
    vKey,
    vValue,
    vKey2,
    vValue2
)
{
    var i, o, vItems;

    vItems = [];
    for (i = 0; i < vList.length; i++)
    {
        if (!(o = vList[i]))
            continue;

        if ((vKey2 && (o[vKey] == vValue && o[vKey2] == vValue2)) ||
            (!vKey2 && (o[vKey] == vValue)))
        {
            vItems.push(o);
        }
    }
    return vItems;
}

//-----------------------------------------------------------------------------------------
function fDeleteFromArray(
    vList,
    vKey,
    vValue,
    vKey2,
    vValue2
)
{
    var i, o;

    for (i = 0; i < vList.length; i++)
    {
        if (!(o = vList[i]))
            continue;

        if ((vKey2 && (o[vKey] == vValue && o[vKey2] == vValue2)) ||
            (!vKey2 && (o[vKey] == vValue)))
        {
            return vList.splice(i, 1);
        }
    }
    return vList;
}

//-----------------------------------------------------------------------------------------
function fMoveUpInArray(
    vList,
    vKey,
    vValue,
    vKey2,
    vValue2
)
{
    var i, o, vTmp;

    for (i = 0; i < vList.length; i++)
    {
        if (!(o = vList[i]))
            continue;

        if ((vKey2 && (o[vKey] == vValue && o[vKey2] == vValue2)) ||
            (!vKey2 && (o[vKey] == vValue)))
        {
            if (i == 0)
                return false;
            vTmp = vList[i - 1];
            vList[i - 1] = o;
            vList[i] = vTmp;
            return true;
        }
    }
    return false;
}

//-----------------------------------------------------------------------------------------
function fMoveDownInArray(
    vList,
    vKey,
    vValue,
    vKey2,
    vValue2
)
{
    var i, o, vTmp;

    for (i = 0; i < vList.length; i++)
    {
        if (!(o = vList[i]))
            continue;

        if ((vKey2 && (o[vKey] == vValue && o[vKey2] == vValue2)) ||
            (!vKey2 && (o[vKey] == vValue)))
        {
            if (i == (vList.length - 1))
                return false;
            vTmp = vList[i + 1];
            vList[i + 1] = o;
            vList[i] = vTmp;
            return true;
        }
    }
    return false;
}

//-----------------------------------------------------------------------------------------
function fGetSameFromArray(
    vList,
    vKey,
    vValue
)
{
    var i, o, vItems;

    vItems = [];
    for (i = 0; i < vList.length; i++)
    {
        o = vList[i];
        if (!o) continue;

        if (o[vKey] == vValue)
            vItems.push(o)
    }

    return vItems;
}

//-----------------------------------------------------------------------------------------
function fGetKeyValuesFromArray(
    vList,
    vKey
)
{
    var i, o, vValues;

    vValues = [];
    for (i = 0; i < vList.length; i++)
    {
        o = vList[i];
        if (!o) continue;

        vValues.push(o[vKey]);
    }

    return vValues;
}

//-----------------------------------------------------------------------------------------
function fTrim(s)
{
    return s ? s.replace(/^\s+|\s+$/g, '') : '';
}

//-----------------------------------------------------------------------------------------
function fGetFilename(vPath)
{
    var vPos;

    vPos = vPath.lastIndexOf('\\');
    if (vPos == -1)
        return vPath;
    return vPath.substr(vPos + 1);
}

//-----------------------------------------------------------------------------------------
function fIsValidEmail(vEmail)
{
    var vRE;

    vRE = /.+@.+\..+/i;
    return vRE.test(vEmail);
}

//-----------------------------------------------------------------------------------------
function fRemoveDuplicates(vList)
{
    var i, vRet, vSeen;

    vRet = [];
    vSeen = {};

    for (i = 0; i < vList.length; i++)
    {
        if (!vSeen[vList[i]])
        {
            vSeen[vList[i]] = 1;
            vRet.push(vList[i]);
        }
    }

    return vRet;
}

//-----------------------------------------------------------------------------------------
function fTransformKeys(
    vMap,
    vData
)
{
    var i, j, o, o2, vKey, vList;

    vList = [];

    for (i = 0; i < vData.length; i++)
    {
        o = vData[i];
        o2 = {};

        for (vKey in vMap)
        {
            if (o[vKey])
                o2[vMap[vKey]] = o[vKey];
        }

        vList.push(o2);
    }

    return vList;
}

//-----------------------------------------------------------------------------------------
function fLog(o)
{
    $.ajax({
        type: 'POST',
        url: '../common/php/util.php?origin=same',
        data: {
            cmd: 'log',
            json: 1,
            data: JSON.stringify(o)
        }
    });
}

//-----------------------------------------------------------------------------------------
function fReplaceInArray(
    vList,
    vKey,
    vTargetId,
    vData
)
{
    var o;

    for (i = 0; i < vList.length; i++)
    {
        o = vList[i];
        if (o[vKey] == vTargetId)
        {
            vList.splice(i, 1, vData);
            break;
        }
    }
}

//-----------------------------------------------------------------------------------------
function fTimeElapsedText(t)
{
    var n, vNow, vDays;

    vNow = Math.floor(new Date().getTime() / 1000);
    vDays = fGetDayInterval(vNow, t);

    if (vDays == 0)
        return g.strs.kUIStrings['ksToday'];
    if (vDays == 1)
        return g.strs.kUIStrings['ksYesterday'];

    return fTimestampToDate(t);
}

//-----------------------------------------------------------------------------------------
/*
 * day interval with timezoon offset
 * @param t1 Unix Timestamp
 * @param t2 Unix Timestamp
 * @return days: days==0 is the same day, days>0 mean t1>t2, days<0 mean t1<t2
 */
function fGetDayInterval(
    t1,
    t2
)
{
    var vTimezoneOffset, vDaySec;

    vTimezoneOffset = new Date().getTimezoneOffset() * 60;
    vDaySec = 24 * 60 * 60;

    t1 -= vTimezoneOffset;
    t1 = Math.floor(t1 / vDaySec);

    t2 -= vTimezoneOffset;
    t2 = Math.floor(t2 / vDaySec);

    return t1 - t2;
}

//----------------------------------------------------------------------------------
function fDateCheck(
    vStart,
    vEnd
)
{
    if (fGetDayInterval(vStart, vEnd) >= 0)
        return 'kOverEndDate';
    if (fGetDayInterval(vEnd, fUnixTimestampNow()) > 1)
        return 'kOverToday';

    return 0;
}

//----------------------------------------------------------------------------------
function fSetButtonGroup(
    vActive,  // 0-based
    vList
)
{
    var i;

    if (!vList)
        return;

    for (i = 0; i < vList.length; i++)
        if ('#' + vList[i])
            $('#' + vList[i]).removeClass('active btn-primary').css('font-weight', 'normal');

    if (vActive >= 0 && vActive < vList.length)
        if ('#' + vList[vActive])
            $('#' + vList[vActive]).addClass('active btn-primary').css('font-weight', 'bold');
}

//----------------------------------------------------------------------------------
// vList: list of objects that have syllabus_code as one of the properties.
// vFilterSyllabus: the syllabus code to keep in result
// return: list of objects of which the syllabus_code's value contains vFilterSyllabus
//-----------------------------------------------------------------------------------------
function fFilterSyllabus(
    vList,
    vFilterSyllabus
)
{
    var vShow, i, o;

    vShow = [];
    for (i = 0; i < vList.length; i++)
    {
        o = vList[i];
        if (o.syllabus_code.search(vFilterSyllabus) != -1)
            vShow.push(o);
    }

    return vShow;
}

//-----------------------------------------------------------------------------------------
// Disable all event listeners of a whole div
// This is done by cloning a node and replace the old new with this new node. This
// new node has all attributes of the old node without event listeners.
//-----------------------------------------------------------------------------------------
function fDisableEventListeners(vDivId)
{
    var vOld, vNew;

    vOld = document.getElementById(vDivId);
    vNew = vOld.cloneNode(true);
    vOld.parentNode.replaceChild(vNew, vOld);
}

//-----------------------------------------------------------------------------------------
// Return the top level domain of the current location
// E.g. return 'us' for a current request to 'mathbuddies.mceducation.us'
//-----------------------------------------------------------------------------------------
function fGetTopLevelDomain()
{
    var full = window.location.host;
    var parts = full.split('.');

    if (parts.length > 0)
        return parts[parts.length - 1].toLowerCase();

    return null;
}

//-----------------------------------------------------------------------------------------
function fFlattenByKey(
    vData,
    vKey
)
{
    var i, vArr;

    vArr = [];
    if (!vData) return vArr;

    for (i = 0; i < vData.length; i++)
        if (vData[i][vKey])
            vArr.push(vData[i][vKey]);

    return vArr;
}

//-----------------------------------------------------------------------------------------
function fGrabUrlVars(vUrl)
{
    var i, o, vPos, vParas, vPair, vObj;

    vUrl = decodeURI(vUrl);

    vPos = vUrl.indexOf('?');
    if (vPos === -1)
        return null;

    vObj = {};
    vPair = [0, 0];

    vParas = vUrl.substring(vPos + 1).split('&');

    for (i = 0; i < vParas.length; i++)
    {
        vPos = vParas[i].indexOf('=');

        vPair[0] = vParas[i].substring(0, vPos);
        vPair[1] = vParas[i].substring(vPos + 1);
        vObj[vPair[0]] = vPair[1];
    }

    return vObj;
}

//-----------------------------------------------------------------------------------------
function fIsNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
}

//-----------------------------------------------------------------------------------------
function fGetDisplay(v)
{
    return v ? v : '--';
}


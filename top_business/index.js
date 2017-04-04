var g, page;

//-----------------------------------------------------------------------------------------
$(document).ready(function ()
{
    fBoot();
	fRun();
});

//-----------------------------------------------------------------------------------------
function fBoot()
{
	g = fInitContext();
	fInitMenu(!g || !g.user);
	
	page = {
		top_businesses_by_category: []
	};
}

//-----------------------------------------------------------------------------------------
function fRun()
{
    fBindBtns();
}

//-----------------------------------------------------------------------------------------
function fBindBtns()
{
	fGetData();
}

//-----------------------------------------------------------------------------------------
function fGetData() {
	$('#wait').show();
	
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'get_data'
		},
		success: function (data) {
			$('#wait').hide();
			
			data = JSON.parse(data);
			
			if (data.errno === kDbSuccess) 
			{
				page.top_businesses_by_category = data.data.top_businesses_by_category;
				fRefresh();
			} else {
				fHandleSysErrs(data.errno);
			}
		}
	});
}

//---------------------------------------------------------------------------------------
function fRefresh()
{
	var vKey, vCategory, vBusinesses, vSectionNo, vSectionDiv;
	
	vSectionNo = 0;
	for (vKey in page.top_businesses_by_category) {
		if (page.top_businesses_by_category.hasOwnProperty(vKey)) {
			vCategory = vKey;
			vBusinesses = page.top_businesses_by_category[vKey];
			
			vSectionDiv = 'section_' + vSectionNo;
			$('#top_business').append(vHtmlCategorySection
					.replace(/<section_id>/, vSectionDiv)
					.replace(/<category>/, vCategory));
			fRenderBusinesses(vSectionDiv, vBusinesses);
			
			vSectionNo++;
		}
	}
	
	fOnPostRefresh();
}

//---------------------------------------------------------------------------------------
function fRenderBusinesses(
	vDivId,
	vBusinessData
) 
{
	var i, o, vBody, vData, vRow;
	
	if (vBusinessData.length === 0) 
	{
		$('#' + vDivId).html("No Data");
	}
		
	vBody = '';
	for (i = 0; i < vBusinessData.length; i++) 
	{
		o = vBusinessData[i];
		vBody += vHtmlSearchItem
					.replace(/<b_business_id>/, o.business_id)
					.replace(/<b_name>/, o.name)
					.replace(/<b_category>/, fYelpCategoriesToStr(o.categories))
					.replace(/<b_address>/, o.full_address)
					.replace(/<b_star>/, o.stars)
					.replace(/<b_review_count>/, o.review_count);
	}
	
	$('#' + vDivId).html(vBody);
}

//---------------------------------------------------------------------------------------
function fOnPostRefresh() 
{
	fBindRowActions();
}

//---------------------------------------------------------------------------------------
function fBindRowActions()
{
	var vCmd, vKey, o;
	
	$('.row-events').unbind('click');
	$('.row-events').click(function(e) {
		vCmd = $(e.target).attr('cmd');
		vKey = $(e.currentTarget).attr('key');
		
		o = fGetBusiness(vKey);
		
		if (!o)
			o = fFindInArray(page.monthly_trends, 'business_id', vKey);
		
		if (!o)
			return;
		
		switch (vCmd)
		{
			case 'view':
				fUpdateContext('business', o);
				fGoto('../view_business/');
				break;
		}
	});
}

//---------------------------------------------------------------------------------------
function fGetBusiness(
	vBusinessId
)
{
	var vKey, vBusinesses, o;
	
	for (vKey in page.top_businesses_by_category) {
		if (page.top_businesses_by_category.hasOwnProperty(vKey)) {
			vBusinesses = page.top_businesses_by_category[vKey];
			o = fFindInArray(vBusinesses, 'business_id', vBusinessId);

			if (o) return o;
		}
	}
	
	return null;
}
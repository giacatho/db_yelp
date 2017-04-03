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
		weekly_trends: [],
		monthly_trends: []
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
				page.weekly_trends = data.data.weekly_trends;
				page.monthly_trends = data.data.monthly_trends;
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
	fRenderWeeklyTrends();
	fRenderMonthlyTrends();

	fOnPostRefresh();
}

//---------------------------------------------------------------------------------------
function fRenderWeeklyTrends() 
{
	var i, o, vBody, vData, vRow;
	
	if (page.weekly_trends.length === 0) 
	{
		$('#weekly_trends').html("No Data");
	}
		
	vBody = '';
	for (i = 0; i < page.weekly_trends.length; i++) 
	{
		o = page.weekly_trends[i];
		vBody += vHtmlWeekItem
					.replace(/<b_business_id>/, o.business_id)
					.replace(/<b_name>/, o.name)
					.replace(/<b_category>/, fYelpCategoriesToStr(o.categories))
					.replace(/<b_address>/, o.full_address)
					.replace(/<b_star>/, o.stars)
					.replace(/<b_review_count>/, o.action_count);
	}
	
	$('#weekly_trends').html(vBody);
}

//---------------------------------------------------------------------------------------
function fRenderMonthlyTrends() 
{
	var i, o, vBody, vData, vRow;
	
	if (page.monthly_trends.length === 0) 
	{
		$('#monthly_trends').html("No Data");
	}
		
	vBody = '';
	for (i = 0; i < page.monthly_trends.length; i++) 
	{
		o = page.monthly_trends[i];
		vBody += vHtmlMonthItem
					.replace(/<b_business_id>/, o.business_id)
					.replace(/<b_name>/, o.name)
					.replace(/<b_category>/, fYelpCategoriesToStr(o.categories))
					.replace(/<b_address>/, o.full_address)
					.replace(/<b_star>/, o.stars)
					.replace(/<b_review_count>/, o.action_count);
	}
	
	$('#monthly_trends').html(vBody);
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
		
		o = fFindInArray(page.weekly_trends, 'business_id', vKey);
		
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
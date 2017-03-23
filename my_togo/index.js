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
	
	if (!g || !g.user)
        window.location = '../login/';
	
	page = {
		data: [],
		fetch : {
			len: 20, 
			offset: 0
		},
		load_more: null
	};
}

//-----------------------------------------------------------------------------------------
function fRun()
{
	fBindBtns();
	fGetData();
}

//-----------------------------------------------------------------------------------------
function fBindBtns()
{
}

//-----------------------------------------------------------------------------------------
function fGetData()
{
	var businesses;
	
	$('#wait').show();
	
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'get_data',
			session_id: g.user.session_id,
			fetch_len: page.fetch.len,
			fetch_offset: page.fetch.len * page.fetch.offset
		},
		success: function (data) {
			$('#wait').hide();
			
			data = JSON.parse(data);
			
			if (data.errno === kDbSuccess) 
			{
				businesses = data.data.businesses;
				
				page.load_more = (businesses.length === page.fetch.len);
				if (businesses.length > 0) {
                    page.fetch.offset++;
                }
				
				page.data = page.data.concat(businesses);
				
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
	var i, o, vBody, vData, vRow;
	
	$('#load_more').remove();
	
	vBody = '';
	if (page.data.length !== 0) 
	{
		for (i = 0; i < page.data.length; i++) 
		{
			o = page.data[i];
			vBody += vHtmlSearchItem
					.replace(/<b_business_id>/, o.business_id)
					.replace(/<b_name>/, o.name)
					.replace(/<b_category>/, fYelpCategoriesToStr(o.categories))
					.replace(/<b_address>/, o.full_address)
					.replace(/<b_star>/, o.stars)
					.replace(/<b_review_count>/, o.review_count);
		}

		if (page.load_more)
			vBody += vHtmlLoadMore;
	}
	
	$('#search-result-items').html(vBody);
	
	fOnPostRefresh();
}

//---------------------------------------------------------------------------------------
function fOnPostRefresh() 
{
	fBindRowActions();
	fBindLoadMore();
}

//---------------------------------------------------------------------------------------
function fBindRowActions()
{
	var vCmd, vKey, o;
	
	$('.row-events').unbind('click');
	$('.row-events').click(function(e) {
		vCmd = $(e.target).attr('cmd');
		vKey = $(e.currentTarget).attr('key');
		
		o = fFindInArray(page.data, 'business_id', vKey);
		
		if (!o)
			return;
		
		switch (vCmd)
		{
			case 'view':
				fUpdateContext('business', o);
				fGoto('../view_business/');
				break;
				
			case 'remove':
				fRemoveToGo(vKey);
				break;
		}
	});
}

//-----------------------------------------------------------------------------------------
function fRemoveToGo(
	vBusinessId
)
{
	var vIndex;
	
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'remove_togo',
			session_id: g.user.session_id,
			business_id: vBusinessId
		},
		success: function (data) {
			data = JSON.parse(data);

			if (data.errno === kDbSuccess) 
			{
				// Refresh the data
				vIndex = fGetPosInArray(page.data, 'business_id', vBusinessId);
				if (vIndex > -1 )
					page.data.splice(vIndex, 1);
				
				fRefresh();
			} else {
				fHandleSysErrs(data.errno);
			}
		}
	});
}

//---------------------------------------------------------------------------------------
function fBindLoadMore() 
{
    $('#load-more').unbind('click');
    $('#load-more').click(function ()
    {
        fGetData();
    });
}
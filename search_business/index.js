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
		business_to_view: null,
		categories: null,
		cities: null,
		data: null,
		fetch: null,
		search: {
			term: null,
			category: '',
			state: '',
			city: ''
		},
		load_more: null
	};
}

//-----------------------------------------------------------------------------------------
function fRun()
{
    fBindBtns();
	fGetDynamicFilters();
}

//-----------------------------------------------------------------------------------------
function fBindBtns()
{
	$('#btn-search').unbind();
	$('#btn-search').click(function() {
		fGetData2();
	});
	
	fGetData2();
}

//-----------------------------------------------------------------------------------------
function fGetDynamicFilters() 
{
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'get_dynamic_filters',
		},
		success: function(data)
		{
			data = JSON.parse(data);
			if (data.errno == kDbSuccess)
			{
				page.categories = data.categories;
				page.cities = data.cities;
				fInitDropdowns();
			} else {
				alert("Initializing filters has error with errno: " + data.errno);
			}
		}
	});
}

//-----------------------------------------------------------------------------------------
function fInitDropdowns() 
{
	fCreateDropdowns();
	fBindDropdowns();
}

//-----------------------------------------------------------------------------------------
function fCreateDropdowns()
{
	fCreateDropCategories(page.categories);
	fCreateDropStates(page.cities);
	fCreateDropCities(page.cities);
}

//-----------------------------------------------------------------------------------------
function fBindDropdowns()
{
	var vId, vKey, vTarget, vCurrentTarget;

    $('.drop_event').unbind('click');
    $('.drop_event').click(function (e) {
        vTarget = $(e.target);
        vCurrentTarget = $(e.currentTarget);

        vId = vCurrentTarget.attr('id');
        vKey = vTarget.attr('key');
        if (!vKey) return;

        fDropPick({id: vId, key: vKey});

        switch (vId)
        {
            case 'drop_category':
                if (vKey == 0)
                    vKey = '';
                
                if (vKey == page.search.category)
                    return;

                page.search.category = vKey;
                fGetData2();
                break;
			
			case 'drop_state':
				if (vKey == 0)
                    vKey = '';
                
                if (vKey == page.search.state)
                    return;

                page.search.state = vKey;
				page.search.city = '';
				
				fCreateDropCities(fGetCitiesByState(page.cities));
				
                fGetData2();
				break;
				
			case 'drop_city':
				if (vKey == 0)
                    vKey = '';
                
                if (vKey == page.search.city)
                    return;

                page.search.city = vKey;
                fGetData2();
		}
	});
}

//-----------------------------------------------------------------------------------------
function fGetCitiesByState(
)
{
	if (page.search.state === '')
		return page.cities;
	
	return fFindInArrayList(page.cities, "state", page.search.state);
}

//-----------------------------------------------------------------------------------------
function fGetData2() {
	fInitFetch();
	fGetData();
}

//-----------------------------------------------------------------------------------------
function fInitFetch()
{
	page.data = [];
	page.fetch = {
		len: 20, 
		offset: 0
	};
	page.search.term = $('#search-term').val();
	page.load_more = false;
}

//-----------------------------------------------------------------------------------------
function fGetData() {
	var businesses;
	
	$('#wait').show();
	
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'get_data',
			fetch_len: page.fetch.len,
			fetch_offset: page.fetch.len * page.fetch.offset,
			search: page.search
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
				alert("Error with errno: " + data.errno);
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
					.replace(/<b_category>/, o.categories)
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
	fOtherUI();
	fBindRowActions();
	fBindLoadMore();
}

//---------------------------------------------------------------------------------------
function fOtherUI() 
{
	var html;
	
	if ($('#search-term').val().trim() !== '') {
		html = "Search Result for '" + $('#search-term').val().trim() + "'";
	} else {
		html = "";
	}
	
	$('#search-result-head').html(html);
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
			case ('view'):
				fUpdateContext('business', o);
				fGoto('../view_business/');
				break;
		}
	})
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
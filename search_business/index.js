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
	page = {
		data: null,
		fetch: {len: 5, offset: 0},
		search: {
			text: 'pizza'
		},
		load_more: null
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
	$('#btn-search').unbind();
	$('#btn-search').click(function() {
		fGetData2();
	});
	
	fGetData2();
}

//-----------------------------------------------------------------------------------------
function fGetData2() {
	fInitFetch();
	fGetData();
}

//-----------------------------------------------------------------------------------------
function fInitFetch()
{
	page = {
		data: [],
		fetch: {len: 20, offset: 0},
		search: {
			term: $('#search-term').val()
		},
		load_more: null
	};
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
	
	if (page.data.length === 0) 
	{
		return;
	}
		
	vBody = '';
	for (i = 0; i < page.data.length; i++) 
	{
		o = page.data[i];
		vBody += vHtmlSearchItem.replace(/<b_name>/, o.name)
				.replace(/<b_category>/, "Categories")
				.replace(/<b_address>/, o.full_address)
				.replace(/<b_star>/, o.stars)
				.replace(/<b_review_count>/, o.review_count);
	}
	
	if (page.load_more)
		vBody += vHtmlLoadMore;
	
	$('#search-result-items').html(vBody);
	
	fOnPostRefresh();
}

//---------------------------------------------------------------------------------------
function fOnPostRefresh() 
{
	fOtherUI();
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
function fBindLoadMore() 
{
    $('#load-more').unbind('click');
    $('#load-more').click(function ()
    {
        fGetData();
    });
}
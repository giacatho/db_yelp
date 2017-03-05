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
		data: null
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
	page.data = [];
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
		},
		success: function (data) {
			$('#wait').hide();
			
			data = JSON.parse(data);
			
			if (data.errno === kDbSuccess) 
			{
				businesses = data.data.businesses;
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
	
	$('#search-result-items').html(vBody);
}
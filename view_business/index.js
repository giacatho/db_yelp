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
		business_id : '-0HGqwlfw3I8nkJyMHxAsQ',
		review_summary: null,
		reviews: [],
		fetch : {
			len: 10,
			offset: 0
		},
		load_more: false
	};
}

//-----------------------------------------------------------------------------------------
function fRun()
{
    fBindBtns();
	fGetReviewSummary();
	fGetData();
}

//-----------------------------------------------------------------------------------------
function fBindBtns()
{
}

//-----------------------------------------------------------------------------------------
function fGetReviewSummary() {
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'get_review_summary',
			business_id: page.business_id
		},
		success: function (data) {
			data = JSON.parse(data);

			if (data.errno === kDbSuccess) 
			{
				page.review_summary = data.data.review_summary;
				
				fRenderReviewSummary();
			} else {
				alert("Error with errno: " + data.errno);
			}
		}
	});
}

//---------------------------------------------------------------------------------------
function fRenderReviewSummary()
{
	var i, vHtml;
	
//	if (page.review_summary.length === 0)
//		return;
	
	vHtml = '\
		<table class="table table-condensed table-bordered">\
			<tr class="text-center"><th>Review Stars</th><th>Total</th></tr>\
	';
	for (i = 0; i < 5; i++) {
		vHtml += '<tr><td> ' + (i+1) + '</td><td>' + fGetReviewTotal(i+1) + '</td></tr>';
	}
	
	vHtml += '\
		</table>\
	';
	
	$('#review-summary').html(vHtml);
}

//---------------------------------------------------------------------------------------
function fGetReviewTotal(
	vStarNumber
)
{
	var i;
	
	for (i = 0; i < page.review_summary.length; i++) {
		if (page.review_summary[i]['stars'] == vStarNumber)
			return page.review_summary[i]['total'];
	}
	
	return 0;
}

//-----------------------------------------------------------------------------------------
function fGetData() {
	var reviews;
	
	$('#wait').show();
	
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'get_reviews',
			business_id: page.business_id,
			fetch_len: page.fetch.len,
			fetch_offset: page.fetch.len * page.fetch.offset
		},
		success: function (data) {
			$('#wait').hide();
			
			data = JSON.parse(data);
			
			if (data.errno === kDbSuccess) 
			{
				reviews = data.data.reviews;
				
				page.load_more = (reviews.length === page.fetch.len);
				if (reviews.length > 0) {
                    page.fetch.offset++;
                }
				
				page.reviews = page.reviews.concat(reviews);
				
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
	
	if (page.reviews.length === 0) 
	{
		return;
	}
		
	vBody = '';
	for (i = 0; i < page.reviews.length; i++) 
	{
		o = page.reviews[i];
		vBody += vHtmlReviewItem.replace(/<r_author>/, o.author)
				.replace(/<r_text>/, o.text)
				.replace(/<r_stars>/, o.stars)
				.replace(/<r_date>/, o.date)
				.replace(/<r_useful>/, o.useful)
				.replace(/<r_useful_style>/, o.useful == 0 ? "display:none;" : "")
				.replace(/<r_cool>/, o.cool)
				.replace(/<r_cool_style>/, o.cool == 0 ? "display:none;" : "")
				.replace(/<r_funny>/, o.funny)
				.replace(/<r_funny_style>/, o.funny == 0 ? "display:none;" : "");
	}
	
	if (page.load_more)
		vBody += vHtmlLoadMore;
	
	$('#review-items').html(vBody);
	
	fOnPostRefresh();
}

//---------------------------------------------------------------------------------------
function fOnPostRefresh() 
{
	fBindLoadMore();
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
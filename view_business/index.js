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
				
				fRenderReviewSummaryChart();
			} else {
				alert("Error with errno: " + data.errno);
			}
		}
	});
}

//---------------------------------------------------------------------------------------
function fRenderReviewSummaryChart()
{
	Highcharts.chart('review-summary-chart', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        title: {
            text: 'Review Summary'
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
        series: [{
            name: 'Total Review',
            data: [
                ['1 star', fGetReviewTotal(1)],
                ['2 stars', fGetReviewTotal(2)],
                ['3 stars', fGetReviewTotal(3)],
                ['4 stars', fGetReviewTotal(4)],
                ['5 stars', fGetReviewTotal(5)]
            ]
        }]
    });
}

//---------------------------------------------------------------------------------------
function fGetReviewTotal(
	vStarNumber
)
{
	var i;
	
	for (i = 0; i < page.review_summary.length; i++) {
		if (page.review_summary[i]['stars'] == vStarNumber)
			return parseInt(page.review_summary[i]['total']);
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
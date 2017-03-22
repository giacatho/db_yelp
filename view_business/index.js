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
	
	if (!g || !g.business) 
		alert("No business. You should go back.");
	
	page = {
		review_summary: null,
		nearby_businesses: [],
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
	fRenderBusinessDetails();
    fBindBtns();
	fGetReviewSummary();
	// fGetNearbyBusinesses(); // This is called from Google Map callback
	fGetRecommendedBusinesses();
	fGetData();
}

//-----------------------------------------------------------------------------------------
function fRenderBusinessDetails()
{
	var vBody;
	
	vBody = vHtmlBusinessDetails
		.replace(/<b_name>/, g.business.name)
		.replace(/<b_category>/, g.business.categories)
		.replace(/<b_address>/, g.business.full_address);
		
	$('#business_details').html(vBody);
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
			business_id: g.business.business_id
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
function fGetNearbyBusinesses(
)
{
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'get_nearby_businesses',
			business_id: g.business.business_id
		},
		success: function (data) {
			data = JSON.parse(data);

			if (data.errno === kDbSuccess) 
			{
				page.nearby_businesses = data.data.nearby_businesses;
				
				fRenderNearbyBusinesses();
				fRenderNearbyMap();
			} else {
				alert("Error with errno: " + data.errno);
			}
		}
	});
}

//-----------------------------------------------------------------------------------------
function fRenderNearbyBusinesses() {
	var i, o, vBody;
	
	vBody = '';
	if (page.nearby_businesses.length !== 0) 
	{
		for (i = 0; i < page.nearby_businesses.length; i++) 
		{
			o = page.nearby_businesses[i];
			vBody += vHtmlNearbyBusinessItem
					.replace(/<b_label>/, kLabels[i % kLabels.length])
					.replace(/<b_name>/, o.name)
					.replace(/<b_category>/, o.categories)
					.replace(/<b_address>/, o.full_address)
					.replace(/<b_star>/, o.stars)
					.replace(/<b_review_count>/, o.review_count);
		}
	}
	
	$('#nearby-business-items').html(vBody);
}

//-----------------------------------------------------------------------------------------
function fRenderNearbyMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 16,
		center: {
			lat: parseFloat(g.business.latitude), 
			lng: parseFloat(g.business.longitude)
		}
	});
	
	new google.maps.Marker({
		position: {
			lat: parseFloat(g.business.latitude), 
			lng: parseFloat(g.business.longitude)
		},
		label: "Y!M",
		title: g.business.name,
		map: map
	})
	
	var markers = page.nearby_businesses.map(function(nearby_business, i) {
		return new google.maps.Marker({
			position: {
				lat: parseFloat(nearby_business.latitude), 
				lng: parseFloat(nearby_business.longitude)
			},
			label: kLabels[i % kLabels.length],
			title: nearby_business.name,
			map: map
		});
	});
}

//-----------------------------------------------------------------------------------------
function fGetRecommendedBusinesses() 
{
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'get_recommended_businesses',
			business_id: g.business.business_id
		},
		success: function (data) {
			data = JSON.parse(data);

			if (data.errno === kDbSuccess) 
			{
				page.also_reviewed_businesses = data.data.also_reviewed_businesses;
				
				fRenderAlsoReviewedBusinesses();
			} else {
				alert("Error with errno: " + data.errno);
			}
		}
	});
}

//-----------------------------------------------------------------------------------------
function fRenderAlsoReviewedBusinesses()
{
	var i, o, vBody;
	
	vBody = '';
	if (page.also_reviewed_businesses.length !== 0) 
	{
		for (i = 0; i < page.also_reviewed_businesses.length; i++) 
		{
			o = page.also_reviewed_businesses[i];
			vBody += vHtmlBusinessItem
					.replace(/<b_name>/, o.name)
					.replace(/<b_category>/, o.categories)
					.replace(/<b_address>/, o.full_address)
					.replace(/<b_star>/, o.stars);
		}
	}
	
	$('#also-reviewed-items').html(vBody);
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
			business_id: g.business.business_id,
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
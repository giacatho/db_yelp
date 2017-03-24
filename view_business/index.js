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
	
	if (!g || !g.business) 
		window.location = "../search_business/";
	
	page = {
		review_summary: null,
		nearby_businesses: [],
		also_reviewed_businesses: [],
		also_tipped_businesses: [],
		reviews: [],
		review_count_by_month: null,
		tip_count_by_month: null,
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
	fRenderBusinessDetails();
	fGetReviewSummary();
	// fGetNearbyBusinesses(); // function called back from Google Map, declare in html
	fGetRecommendedBusinesses();
	fGetData();
	fGetStatistics();
}

//-----------------------------------------------------------------------------------------
function fRenderBusinessDetails()
{
	$('#business_name').html(g.business.name);
	$('#business_address').html(g.business.full_address);
}

//-----------------------------------------------------------------------------------------
function fBindBtns()
{
	$('#btn-add').unbind('click');
	$('#btn-add').click(function() {
		if (!g.user) {
			window.location = '../login/';
		} else {
			fAddToGo();
		} 
	});
}

//-----------------------------------------------------------------------------------------
function fAddToGo()
{
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'add_togo',
			session_id: g.user.session_id,
			business_id: g.business.business_id
		},
		success: function (data) {
			data = JSON.parse(data);

			if (data.errno === kDbSuccess) 
			{
				$('#btn-add').hide();
				bootbox.alert("Adding to ToGo list is successfully.");
			} else {
				fHandleSysErrs(data.errno);
			}
		}
	});
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
				fHandleSysErrs(data.errno);
			}
		}
	});
}

//---------------------------------------------------------------------------------------
function fRenderReviewSummaryChart()
{
	var oneCount, twoCount, threeCount, fourCount, fiveCount;
	
	oneCount = fGetReviewTotal(1);
	twoCount = fGetReviewTotal(2);
	threeCount = fGetReviewTotal(3);
	fourCount = fGetReviewTotal(4);
	fiveCount = fGetReviewTotal(5);
	
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
		subtitle: {
            text: (oneCount + twoCount + threeCount + fourCount + fiveCount) + ' Reviews'
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
                ['1 star', oneCount],
                ['2 stars', twoCount],
                ['3 stars', threeCount],
                ['4 stars', fourCount],
                ['5 stars', fiveCount]
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
				fHandleSysErrs(data.errno);
			}
		}
	});
}

//-----------------------------------------------------------------------------------------
function fRenderNearbyBusinesses() {
	var i, o, vBody;
	
	if (page.nearby_businesses.length == 0) {
		$('#nearby-business-items').html("No Data");
		return;
	}
	
	vBody = '';
	for (i = 0; i < page.nearby_businesses.length; i++) 
	{
		o = page.nearby_businesses[i];
		vBody += vHtmlNearbyBusinessItem
				.replace(/<b_business_id>/, o.business_id)
				.replace(/<b_label>/, kLabels[i % kLabels.length])
				.replace(/<b_name>/, o.name)
				.replace(/<b_category>/, fYelpCategoriesToStr(o.categories))
				.replace(/<b_address>/, o.full_address)
				.replace(/<b_star>/, o.stars);
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
				page.also_tipped_businesses = data.data.also_tipped_businesses;
				
				fRenderAlsoReviewedBusinesses();
				fRenderAlsoTippedBusinesses();
				
				fBindRowActions();
			} else {
				fHandleSysErrs(data.errno);
			}
		}
	});
}

//-----------------------------------------------------------------------------------------
function fRenderAlsoReviewedBusinesses()
{
	var i, o, vBody;
	
	if (page.also_reviewed_businesses.length == 0) {
		$('#also-reviewed-items').html("No Data");
	} 
	
	vBody = '';
	for (i = 0; i < page.also_reviewed_businesses.length; i++) 
	{
		o = page.also_reviewed_businesses[i];
		vBody += vHtmlBusinessItem
				.replace(/<b_business_id>/, o.business_id)
				.replace(/<b_name>/, o.name)
				.replace(/<b_category>/, fYelpCategoriesToStr(o.categories))
				.replace(/<b_address>/, o.full_address)
				.replace(/<b_star>/, o.stars);
	}
	
	$('#also-reviewed-items').html(vBody);
}

//-----------------------------------------------------------------------------------------
function fRenderAlsoTippedBusinesses()
{
	var i, o, vBody;
	
	if (page.also_tipped_businesses.length == 0) {
		$('#also-tipped-items').html("No Data");
		return;
	} 
	
	vBody = '';
	for (i = 0; i < page.also_tipped_businesses.length; i++) 
	{
		o = page.also_tipped_businesses[i];
		vBody += vHtmlBusinessItem
				.replace(/<b_business_id>/, o.business_id)
				.replace(/<b_name>/, o.name)
				.replace(/<b_category>/, fYelpCategoriesToStr(o.categories))
				.replace(/<b_address>/, o.full_address)
				.replace(/<b_star>/, o.stars);
	}
	$('#also-tipped-items').html(vBody);
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
	fBindRowActions();
	fBindLoadMore();
}

//---------------------------------------------------------------------------------------
function fGetStatistics()
{
	$.ajax({
		type: "POST",
		url: "index.php",
		data: {
			cmd: "get_statistics",
			business_id: g.business.business_id
		},
		success: function (data) {
			data = JSON.parse(data);
			
			if (data.errno === kDbSuccess) 
			{
				page.review_count_by_month = data.data.review_count_by_month;
				page.tip_count_by_month = data.data.tip_count_by_month;
				
				fRenderStatistics(page.review_count_by_month, "review-statistics-chart", "Review");
				fRenderStatistics(page.tip_count_by_month, "tip-statistics-chart", "Tip");
			} else {
				fHandleSysErrs(data.errno);
			}
		}
	});
}

//---------------------------------------------------------------------------------------
function fRenderStatistics(
	vStatisticsData,
	vDivId,
	vLabel
)
{
	var year, month, start_year, end_year, start_month, end_month, xAxis, yAxis, vStatisticsData;
	
	if (vStatisticsData.length == 0) {
		$('#' + vDivId).html("No Data");
		return;
	}
		
	start_year = parseInt(vStatisticsData[0]['year']);
	start_month = parseInt(vStatisticsData[0]['month']);
	end_year = parseInt(vStatisticsData[vStatisticsData.length-1]['year']);
	end_month = parseInt(vStatisticsData[vStatisticsData.length-1]['month']);
	
	xAxis = [];
	yAxis = [];
	for (year = start_year; year <= end_year; year++) {
		for (month = 1; month <= 12; month++) {
			if (year == start_year && month < start_month)
				continue;
			
			if (year == end_year && month > end_month)
				continue;
			
			xAxis.push(month + "/" + year);
			yAxis.push(fGetMonthCount(vStatisticsData, year, month));
		}
	}
	
	Highcharts.chart(vDivId, {
        title: {
            text: vLabel + ' Count By Month'
        },
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: vLabel + ' Count'
            },
            plotLines: [{
                color: '#808080'
            }]
        },
        series: [{
            name: vLabel,
            data: yAxis
        }]
    });
}

//---------------------------------------------------------------------------------------
function fGetMonthCount(
	vStatisticsData,
	vYear,
	vMonth
)
{
	var i;
	for (i = 0; i < vStatisticsData.length; i++)
	{
		if (vStatisticsData[i]['year'] == vYear && vStatisticsData[i]['month'] == vMonth)
			return parseInt(vStatisticsData[i]['count']);
	}
	
	return 0;
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

//---------------------------------------------------------------------------------------
function fBindRowActions()
{
	var vCmd, vKey, o;
	
	$('.row-events').unbind('click');
	$('.row-events').click(function(e) {
		vCmd = $(e.target).attr('cmd');
		vKey = $(e.currentTarget).attr('key');
		
		o = fFindInArray(page.nearby_businesses, 'business_id', vKey);
		if (!o)
			o = fFindInArray(page.also_reviewed_businesses, 'business_id', vKey);
		if (!o)
			o = fFindInArray(page.also_tipped_businesses, 'business_id', vKey);
		
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
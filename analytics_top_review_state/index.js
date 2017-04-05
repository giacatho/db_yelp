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
}

//-----------------------------------------------------------------------------------------
function fRun()
{
    fBindBtns();
	fGetTopReviewStates();
}

//-----------------------------------------------------------------------------------------
function fBindBtns()
{
}

//-----------------------------------------------------------------------------------------
function fGetTopReviewStates()
{
	$('#wait').show();
	
    $.ajax({
        type: 'GET',
        url: 'index.php',
        data: {
            cmd: 'get_top_review_state'
        },
        success: function (vData)
        {
			$('#wait').hide();
            vData = JSON.parse(vData);
            if (vData.errno == kDbSuccess)
            {
				fRenderChart(vData.data.categories);
            }
            else {
				bootbox.alert("Can not retrieve data. Server error with errno: " + vData.errno);
			}
        }
    });
}
//-----------------------------------------------------------------------------------------
function fRenderChart(
	vCategories	
)
{
	var data, vCategory, i, vData, vPercentage;
	
	data = {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: 0,
			plotShadow: false
		},
		title: {
			text: 'Category And Most Review State'
		},
		tooltip: {
			pointFormat:  '{series.name}: <b> {point.usa_state} </b> <br/> <b>{point.y}%</b>'  
		},
		plotOptions: {
			pie: {
				dataLabels: {
					enabled: false
				},
				showInLegend: true,
				startAngle: -90,
				endAngle: 90,
				center: ['50%', '60%']
			}
		}
	};
		
	vData = [];
	for (i = 0; i < vCategories.length; i++) {
		vCategory = vCategories[i];
		vPercentage = parseInt(vCategory['state_review_count']) * 100/parseInt(vCategory['total_review_count']);
		
		vData.push({
			name: vCategory['category'],
			y: parseFloat(vPercentage.toFixed(2)),
			usa_state: vCategory['state']
		});
	}
	
	data.series = [{
		type: 'pie',
        name: 'Top State',
        innerSize: '50%',
		data: vData
	}];
	
	Highcharts.chart('business_chart', data);
}
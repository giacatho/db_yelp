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
	fGetCoolestRestaurants();
}

//-----------------------------------------------------------------------------------------
function fBindBtns()
{
}

//-----------------------------------------------------------------------------------------
function fGetCoolestRestaurants()
{
	$('#wait').show();
	
    $.ajax({
        type: 'GET',
        url: 'index.php',
        data: {
            cmd: 'get_coolest_business'
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
	var data, vCategory, i, vData;
	
	data = {
		chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Coolest Category Percentage'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
				},
				showInLegend: true
			}
        }
	};
		
	vData = [];
	for (i = 0; i < vCategories.length; i++) {
		vCategory = vCategories[i];
		
		vData.push({
			name: vCategory['category'],
			y: parseInt(vCategory['count']),
			sliced: vCategory['category'] == 'Restaurants' ? true : false
		});
	}
	
	data.series = [{
		name: 'Popularity',
		colorByPoint:true,
		data: vData
	}];
	
	Highcharts.chart('business_chart', data);
}
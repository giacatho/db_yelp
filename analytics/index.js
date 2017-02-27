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
    };
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
        type: 'POST',
        url: 'index.php',
        data: {
            cmd: 'get_coolest_restaurants'
        },
        success: function (vData)
        {
			$('#wait').hide();
            vData = JSON.parse(vData);
            if (vData.errno == kDbSuccess)
            {
				fRenderChart(vData.data.restaurants);
            }
            else {
				bootbox.alert("Can not retrieve data. Server error with errno: " + vData.errno);
			}
        }
    });
}

//-----------------------------------------------------------------------------------------
function fRenderChart(
	vRestaurants	
)
{
	var data, series, i, vRestaurant;
	
	data = {
		chart: {
            type: 'column'
        },
        title: {
            text: 'Coolest Restaurants'
        },
        subtitle: {
            text: ''
        },
		yAxis: {
//            min: 0,
            title: {
                text: 'Cool Votes'
            }
        },
		xAxis: {
			title: {
				text: null
			},
			labels: {
				enabled: false //default is true
			}
		},
		tooltip: {
			formatter: function() {
				return '<b>' + this.series.name + '</b>. Cool votes: <b>' + this.y + '</b>';
			}
		},
		legend: {
			enabled: false
		}
	};
		
	series = [];
	for (i = 0; i < vRestaurants.length; i++) {
		vRestaurant = vRestaurants[i];
		series.push({
			name: vRestaurant['name'],
			data: [parseInt(vRestaurant['coolness'])]
		});
	}
	
	data.series = series;
	
	Highcharts.chart('coolest_restaurant_chart', data);
}
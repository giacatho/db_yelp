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
    $.ajax({
        type: 'POST',
        url: 'index.php',
        data: {
            cmd: 'get_coolest_restaurants'
        },
        success: function (vData)
        {
            vData = JSON.parse(vData);
            if (vData.errno == kDbSuccess)
            {
				fRenderChart(vData.restaurants);
            }
            else {
				bootbox.alert("Can not retrieve data. Server error with errno: " + vData.errno);
			}
        }
    });
}

//--
function fRenderChart(
	vRestaurants	
)
{
	Highcharts.chart('coolest_restaurant_chart', {
    chart: {
        type: 'spline',
        inverted: true
    },
    title: {
        text: 'Atmosphere Temperature by Altitude'
    },
    subtitle: {
        text: 'According to the Standard Atmosphere Model'
    },
    xAxis: {
        reversed: false,
        title: {
            enabled: true,
            text: 'Altitude'
        },
        labels: {
            formatter: function () {
                return this.value + 'km';
            }
        },
        maxPadding: 0.05,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Temperature'
        },
        labels: {
            formatter: function () {
                return this.value + '°';
            }
        },
        lineWidth: 2
    },
    legend: {
        enabled: false
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x} km: {point.y}°C'
    },
    plotOptions: {
        spline: {
            marker: {
                enable: false
            }
        }
    },
    series: [{
        name: 'Temperature',
        data: [[0, 15], [10, -50], [20, -56.5], [30, -46.5], [40, -22.1],
            [50, -2.5], [60, -27.7], [70, -55.7], [80, -76.5]]
    }]
});
}
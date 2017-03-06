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
            cmd: 'get_coolest_restaurants'
        },
        success: function (vData)
        {
			$('#wait').hide();
            vData = JSON.parse(vData);
            if (vData.errno == kDbSuccess)
            {
				fRenderTable(vData.data.restaurants);
				fRenderChart(vData.data.restaurants);
            }
            else {
				bootbox.alert("Can not retrieve data. Server error with errno: " + vData.errno);
			}
        }
    });
}

//-----------------------------------------------------------------------------------------
function fRenderTable(
	vRestaurants
)
{
	var vHtml, i, vRestaurant;

	vHtml = "<table class='table table-bordered table-striped'>" +
				"<tr>" +
 					"<th>Business</th>" +
					"<th>Address</th>" +
					"<th>Cool Votes</th>" +
				"</tr>";
	
	for (i = 0; i < vRestaurants.length; i++) {
		vRestaurant = vRestaurants[i];
		
		vHtml += "<tr>" +
					"<td>" + vRestaurant['name'] + "</td>" +
					"<td>" + vRestaurant['full_address'] + "</td>" +
					"<td>" + vRestaurant['coolness'] + "</td>" +
				 "</tr>";
	}
	
	vHtml += "</table>";
	
	$('#coolest_restaurant_table').html(vHtml);
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
var kLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

var vHtmlNearbyBusinessItem = "\
	<div class='list-group-item'>\
		<div class='media'>\
			<div class='pull-left'>\
				<span class='btn btn-primary'><b_label></span>\
			</div>\
			<div class='media-body'>\
				<h4 class='media-heading'></span><b_name> <small><b_category></small></h4>\
				<div class='media-content'>\
					<i class='fa fa-map-marker'></i> <b_address>\
					<ul class='list-unstyled'>\
						<li>Stars: <i class='fa fa-skype'></i> <b_star></li>\
						<li>Review Count: <i class='fa fa-mobile'></i> <b_review_count></li>\
					</ul>\
				</div>\
			</div>\
		</div>\
	</div>\
";

var vHtmlReviewItem2 = "\
	<div>\
		<div><r_stars> out of 5</div>\
		<div>By <r_author></div>\
		<div>On <r_date></div>\
		<div><r_text></div>\
		<div><r_useful> useful | <r_cool> cool | <r_funny> funny\
	</div>\
";

var vHtmlReviewItem = '\
	<li class="media">\
		<div class="media-body">\
			<div class="well" style="background-color:#ffffff;">\
				<h5 class="media-heading reviews"><r_author></h5>\
				<span class="media-date text-uppercase reviews list-inline"><r_date></span>\
				<p><i><r_stars> star(s) out of 5</i></p>\
				<p class="media-comment"><r_text></p>\
				<span class="btn btn-info btn-circle" style="<r_cool_style>"><r_cool> people found this cool</span>\
				<span class="btn btn-success btn-circle" style="<r_useful_style>"><r_useful> people found this useful</span>\
				<span class="btn btn-warning btn-circle" style="<r_funny_style>"><r_funny> people found this funny</span>\
			</div>\
		</div>\
	</li>\
	';


var vHtmlLoadMore = "\
	<div id='load-more-row' class='list-group-item ' style='text-align:center;'>\
		<div id='load-more' style='width:300px; style='margin:0 auto;' class='btn btn-primary'>Load More</div>\
	</div>\
";
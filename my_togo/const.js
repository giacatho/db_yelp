var vHtmlSearchItem = "\
	<div key='<b_business_id>' class='list-group-item row-events'>\
		<div class='media'>\
			<div class='pull-right'>\
				<button cmd='remove' class='btn btn-info'>Remove</button>\
			</div>\
			<div class='media-body'>\
				<h4 class='media-heading'><span cmd='view' style='color: #dd4814;cursor:pointer;'><b_name></span> <small><b_category></small></h4>\
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

var vHtmlLoadMore = "\
	<div id='load-more-row' class='list-group-item ' style='text-align:center;'>\
		<div id='load-more' style='width:300px; style='margin:0 auto;' class='btn btn-primary'>Load More</div>\
	</div>\
";
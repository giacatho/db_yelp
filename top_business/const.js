var vHtmlSearchItem = "\
	<div key='<b_business_id>' class='list-group-item row-events'>\
		<div class='media'>\
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

var vHtmlCategorySection = '\
	<div class="search-result well">\
		<h4 style="font-weight: bold;"><category></h4>\
		<div id="<section_id>" class="list-group business-group">	\
		</div>\
	</div>\
';
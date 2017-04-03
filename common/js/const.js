//-----------------------------------------------------------------------------------------
var kDbInvalidSession = 539;
var kDbSuccess = 540;
var kDbError = 541;
var kDbDuplicate = 542;
var kDbNotFound = 543;

//-----------------------------------------------------------------------------------------
var kHtmlSignedInMenu = '\
	<div class="container-fluid">\
		<div class="navbar-header">\
			<a class="navbar-brand" href="../search_business/">Yelp!Me</a>\
		</div>\
		<div class="navbar-collapse collapse">\
			<ul class="nav navbar-nav">\
				<li><a href="../search_business/">Search Business</a></li>\
				<li><a href="../my_togo/">My ToGo</a></li>\
				<li><a href="../trending_business/">Trending Business</a></li>\
				<li class="dropdown"><a class="dropdown-toggle"\
					data-toggle="dropdown" href="#">Analytics <span class="caret"></span></a>\
					<ul class="dropdown-menu">\
						<li><a href="../analytics_coolest_restaurants/">Coolest Restaurants</a></li>\
						<li><a href="role?action=list">Best Reviews</a></li>\
					</ul>\
				</li>\
				<li><a href="../about/">About</a></li>\
			</ul>\
			<ul class="nav navbar-nav navbar-right">\
				<li class="dropdown">\
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">Hi, How are you?<span class="caret"></span></a>\
					<ul class="dropdown-menu">\
						<li><a href="../logout/">Logout</a>\
					</ul>\
				</li>\
			</ul>\
		</div>\
	</div>\
';

var kHtmlGuestMenu = '\
	<div class="container-fluid">\
		<div class="navbar-header">\
			<a class="navbar-brand" href="../search_business/">Yelp!Me</a>\
		</div>\
		<div class="navbar-collapse collapse">\
			<ul class="nav navbar-nav">\
				<li><a href="../search_business/">Search Business</a></li>\
				<li><a href="../trending_business/">Trending Business</a></li>\
				<li class="dropdown"><a class="dropdown-toggle"\
					data-toggle="dropdown" href="#">Analytics <span class="caret"></span></a>\
					<ul class="dropdown-menu">\
						<li><a href="../analytics_collest_restaurants/">Coolest Restaurants</a></li>\
						<li><a href="role?action=list">Best Reviews</a></li>\
					</ul>\
				</li>\
				<li><a href="../about/">About</a></li>\
			</ul>\
			<ul class="nav navbar-nav navbar-right">\
				<li><a href="../login/">Login</a></li>\
				<li><a href="../register/">Registration</a></li>\
			</ul>\
		</div>\
	</div>\
';
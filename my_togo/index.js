var g, page;

//-----------------------------------------------------------------------------------------
$(document).ready(function ()
{
    fBoot();
    // fRun();
});

//-----------------------------------------------------------------------------------------
function fBoot()
{
	g = fInitContext();
	
	if (!g || !g.user)
        window.location = '../login/';
	
	page = {
		categories: null,
		cities: null,
		data: null,
		fetch: null,
		search: {
			term: null,
			category: '',
			state: '',
			city: ''
		},
		load_more: null
	};
}

//-----------------------------------------------------------------------------------------
function fRun()
{
    fBindBtns();
	fGetDynamicFilters();
}

//-----------------------------------------------------------------------------------------
function fBindBtns()
{
	$('#btn-search').unbind();
	$('#btn-search').click(function() {
	});
	
}
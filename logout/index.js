var g, page;

//-----------------------------------------------------------------------------------------
$(document).ready(function ()
{
    fBoot();
    fRun();
});

//-----------------------------------------------------------------------------------------
function fBoot(){
	g = fInitContext();
	fInitMenu(!g || !g.user);
	
	if (!g || !g.user)
        window.location = '../login/';
}

//-----------------------------------------------------------------------------------------
function fRun()
{
    fLogout();
}

//-----------------------------------------------------------------------------------------
function fLogout()
{
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'logout',
			session_id: g.user.session_id
		},
		success: function(data)
		{
			fUpdateContext("user", null);
			window.location = '../login/';
		}
	});
}
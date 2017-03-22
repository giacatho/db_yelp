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
}

//-----------------------------------------------------------------------------------------
function fRun()
{
    fBindBtns();
}

//-----------------------------------------------------------------------------------------
function fBindBtns()
{
	var vErr;
	
	$('#btn-login').unbind();
	$('#btn-login').click(function() {
		vErr = fCheckInput();
		
		if (vErr == '') {
			fLogin();
		} else {
			bootbox.alert(vErr);
		}
	});
}

//-----------------------------------------------------------------------------------------
function fCheckInput()
{
	if ($.trim($('#email').val()) == '' || $.trim($('#password').val()) == '') {
		return 'All fields are required.';
	}
	
	return '';
}

//-----------------------------------------------------------------------------------------
function fLogin()
{
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'login',
			email: $.trim($('#email').val()),
			password: $.trim($('#password').val())
		},
		success: function(data)
		{
			data = JSON.parse(data);
			if (data.errno == kDbSuccess)
			{
				fUpdateContext("user", {session_id: data.data.session_id});
				
				bootbox.alert("Login is successful!", function(ok) {
					window.location = '../my_togo/';
				});
			} else if (data.errno == kDbNotFound) {
				bootbox.alert("Email and/or Password is incorrect.")
			}
			else {
				bootbox.alert("Login has error with errno: " + data.errno);
			}
		}
	});
}
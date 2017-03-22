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
	
	$('#btn-register').unbind();
	$('#btn-register').click(function() {
		vErr = fCheckInput();
		
		if (vErr == '') {
			fRegister();
		} else {
			bootbox.alert(vErr);
		}
	});
}

//-----------------------------------------------------------------------------------------
function fCheckInput()
{
	if ($.trim($('#email').val()) == '' || $.trim($('#password').val()) == '' ||
			$.trim($('#confirm-password').val()) == '') {
		return 'All fields are required.';
	}
	
	if (!fValidateEmail($.trim($('#email').val())))
		return 'Please input a valid email.';
	
	if ($.trim($('#password').val()) !== $.trim($('#confirm-password').val()))
		return 'Passwords mismatch';
	
	return '';
}

//-----------------------------------------------------------------------------------------
function fValidateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//-----------------------------------------------------------------------------------------
function fRegister()
{
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: {
			cmd: 'register',
			email: $.trim($('#email').val()),
			password: $.trim($('#password').val())
		},
		success: function(data)
		{
			data = JSON.parse(data);
			if (data.errno == kDbSuccess)
			{
				bootbox.alert("Registration is successful!", function(ok) {
					window.location = '../login/';
				});
			} else if (data.errno == kDbDuplicate) {
				bootbox.alert("Email has been used. Please select another email.");
			}
			else {
				alert("Registration has error with errno: " + data.errno);
			}
		}
	});
}
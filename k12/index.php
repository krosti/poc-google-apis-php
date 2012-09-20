<?php session_start();  ?>
<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>K12 - Prototype</title>
	
	<!-- This header mimics Internet Explorer 7 and uses 
	     <!DOCTYPE> to determine how to display the webpage -->
	<!--meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" -->
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700,300' rel='stylesheet' type='text/css'>
	<link href="css/style.css" rel="stylesheet" type="text/css" />
	<link href="css/jquery-ui-1.8.23.custom.css" rel="stylesheet" type="text/css" />
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
	<script type="text/javascript">
		//global SCOPE
		var 	test_domain 	= "http://localhost/k12/xoauth-php/three-legged.php"
			,	domain 			= document.URL.split('/');

		_SERVER = domain[0]+'//'+domain[2]+'/'+domain[3]+'/'+domain[4]+"/xoauth-php/three-legged.php?method=";
		_CLIENTID = "839403186376-i9cjktapu32p070sd8b22voccr36nsea.apps.googleusercontent.com";
		_DEVELOPER_ID = 'AIzaSyAcpP_7b9_F0Fvvwk5h9OQBGppKecvF220';
		__DOMAIN = 'k12.com';
		_URL = document.URL.split('/');
	</script>
</head>
<body>

<?php if(isset($_SESSION['user'])): ?>
	<div id="statusMSG"></div>

	<div class="bar">
		<ul>
			<li><a href="#" id="LINKhome">Home</a></li>
			<li>|</li>
			<li><a href="#" id="LINKsendemail">Compose</a></li>
			<li>|</li>
			<li><a href="#" id="LINKsendcalendar">Calendar</a></li>
			<li>|</li>
			<li><a href="#" id="LINKsendgroups">Groups</a></li>
			<li>|</li>
			<li><a href="#" id="LINKshareFiles">Files</a></li>
			
			<li style="float: right; font-size: 11px; margin-top: 3px; margin-right: 10px;" id="userName"></li>
			<!--li style="float:right; font-weight:normal;">online</li-->
		</ul>
	</div>
	<div id="feeddiv"></div>
	<!--header-->
	<div class="block header">
		<span id="userLogged"></span>
		<span id="error"></span>
	</div>
	<!--header-->

	<!--menu-->
	<div class="block menu">
		<ul id="foldersBox"></ul>
	</div>
	<!--menu-->

	<!--calendar-->
	<div class="block calendar">
		<div class="title"><span>MY CALENDARS</span></div>
		
	</div>
	<!--calendar-->	

	<!--groups-->
	<div class="block groups">
		<div class="title"><span>MY GROUPS</span></div>
		<ul id="groups">
			
		</ul>
	</div>
	<!--groups-->	

	<!--///////////////////////////////////////////////////////////////////////-->	

	<!--container-->
	<div class="block container">
		<div id="counters">
			<div id="results">Total Inbox <span id="total_emails"></span></div>
			<div id="unread">Unread Emails <span id="unread_emails"></span></div>
		</div>

		<div id="formToSend">
			<form id="form3" action="/" method="post">	
		
				<div class="title"><span>COMPOSE EMAIL</span></div>
				<img class="flagPopUp" src="images/flag.png">
			
				<fieldset><legend>New Email</legend>
					
					<p>
						<label for="email">To</label>
						<input type="text" name="email" id="emailTO" size="30" value="">
					</p>
					<p>
						<label for="web">Subject</label>
						<input type="text" name="subject" id="email_subject" size="30">
					</p>
				</fieldset>
				<fieldset class="last">																					
					<p>
						<label for="message">Message</label>
						<textarea name="message" id="emailMESSAGE" cols="30" rows="10" placeholder="message here"></textarea>
					</p>					
								
				</fieldset>					
				
				<p class="submit"><a type="submit">Send</a></p>			
				<p class="cancel"><a id="cancel">Cancel</a></p>
			</form>
		</div>
		<div id="emailsWrapper"><table id="emails"></table></div>
	    <div id="authInfo" style="display:none">
	    	<div class="divisor"></div>
	    </div>
	</div>
	<!--container-->

	<div class="block menuLeft" style="display:none">
		
	</div>

	<div class="block menuRight">
		<span>Chat</span>
		<div id="chatStatus"></div>
		<a id="loginBTN" style="display:block;">Login</a>

		<img id="loadingChat" src="images/loading.gif">
		<div id="log"></div>
		<div id="contacts"></div>
	</div>

	<div class="block share" style="display:none">
		<div class="left">
			<div class="title">
				<span>MY FILES</span>
				<a id="shareGooglePicker" href="#" style="float: right; margin-top: 0px; margin-left:2px;"><img src="images/upload.png"></a>
			</div>
			<span>Drive Folders</span>
			[	<span id="ownerDriveFiles"><img src="images/user.png" width="8"></span>
				/<span id="othersDriveFiles"><img src="images/users.png" width="12"></span>
				/<span id="allDriveFiles"><a>All</a></span>
			]
			<div id="driveResultsFolders"></div>
			<br>
			<span>Drive Files</span>
			<div id="driveResultsFiles"></div>

		</div>
		
		<div class="right">
			<div class="title">
				<span>TEACHER DROPBOX</span>
				<div class="block"><img src="images/box.png" id="newTeacherBox" style="float: left; margin-left: 4px; width: 25px;"></div>
				<img src="images/cloud.png" onClick="s.showSettingsDialog()" style="float: right; margin-top: -10px; margin-left:2px;">
			</div>
			<div id="teacherFolder">
			</div>
			<div id="teachersClouds">
				<div>
					<span class="block">Ms Smith-Math</span>
					<img src="images/cloud-box.jpg" style="float:left; clear:both;" id="0B6vivFrkxCl3LXh3LTRVZjhiOEU" width="200">
				</div>
				<div>
					<span class="block">Ms Herold English</span>
					<img src="images/cloud-box.jpg" style="float:left; clear:both;" id="0B6vivFrkxCl3UjM5N05zTXgtZ3c" width="200">
				</div>
				<div>
					<span class="block">Ms Pefieffer History</span>
					<img src="images/cloud-box.jpg" style="float:left; clear:both;" id="0BwvHQTCDFlWlUDlIZG9xV1lnNE0" width="200">
				</div>
			</div>

		</div>

		<div id="googlePicker"></div>
		<div id="newFolderDialog">
			<label>Name</label> <input class="name" type="text" width="300">
			<br>
			<label>Url</label> <input class="url" type="text" width="300">
			<br>
			<a href="#">Add</a>
		</div>
	</div>	

	<!--LOGIN-->
	<div id="login" style="display:none;">
		<input class="user" placeholder="user"></input>	
		<input class="password" placeholder="password" type="password"></input>
	</div>
	<!--LOGIN-->

	<div id="spin"></div>

	<div id="oauth2"></div>

	<script type="text/javascript">
    	//google.load("feeds", "1");
    	google.load("gdata", "2.x");

		function load(){
			//personal API KEY, development APIKEY
			gapi.client.setApiKey(_DEVELOPER_ID);
		    gapi.client.load('drive', 'v2',app._init);
		    
		    //google picker loader
	    	google.load('picker', '1', {'callback':gdrive.filePicker});

	    	//load File Sharing Options DialogBox - **need app already installed on the account
			gapi.load('drive-share', gdrive.shareDialog);
		}
	</script>
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	<script type="text/javascript" src="https://apis.google.com/js/api.js"></script>
    <script src="https://apis.google.com/js/client.js?onload=load"></script>
    <script type="text/javascript" src="js/jquery.xmpp.js"></script>

    
    <!--script src="js/strophe.js"></script-->
    <script src="js/spin.js"></script>

    <script src="js/js.js"></script>
    <script src="js/google_mail.js"></script>
    <script src="js/google_drive.js"></script>
    <script src="js/google_talk.js"></script>
    <script src="js/google_groups.js"></script>
    <script src="js/google_calendar.js"></script>
    <script src="js/google_user.js"></script>
   
<?php else: ?>
	
	<script type="text/javascript">
		$('#login').dialog({
			title: 'Login',
			height: 150,
			width:180,
			modal: true,
			buttons: {
				"Ok": function(ui) {
					var login = $('#login')
					,	user = login.find('.user')
					,	pw = login.find('.password');
					if(user.val() != '' && pw.val() != ''){
						__USR = user.val();
						__PW = pw.val();
						$.ajax({
							url:_SERVER+'saveSession&user='+__USR+'&pw='+__PW,
							success: function(data){
								console.log(data);
								//if(data){
									$( this ).dialog( "close" );
									//location.reload();
								//}else{
									//console.log('error to save login session');
								//}
							}

						});	
					}
				},
				Cancel: function() {
					//$( this ).dialog( "close" );
				}
			}
		});
	</script>
<?php endif; ?>
</body>
</html>

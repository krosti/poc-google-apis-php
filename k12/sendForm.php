<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<title>K12 - google api's</title>
	
	<!-- This header mimics Internet Explorer 7 and uses 
	     <!DOCTYPE> to determine how to display the webpage -->
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" >    
	<!--link href="css/style.css" rel="stylesheet" type="text/css" /-->
	<link href="css/form3.css" rel="stylesheet" type="text/css" />
</head>

<body>
<div id="formToSend">

	<form id="form3" action="/" method="post">	
		
		<h3><span>Contact Us</span></h3>
	
		<fieldset><legend>Contact form</legend>
			<p class="first">
				<label for="name">Name</label>
				<input type="text" name="name" id="name" size="30">
			</p>
			<p>
				<label for="email">To</label>
				<input type="text" name="email" id="emailTO" size="30" value="<?php echo $_GET['to']?>">
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
		
		<p class="submit"><button type="submit">Send</button></p>			
		<p class="cancel"><button type="cancel" id="cancel">Cancel</button></p>			
					
	</form>
</div>

<div id="spin"></div>

</body>
	<script type="text/javascript">
		function load(){
			//personal API KEY
			gapi.client.setApiKey('AIzaSyAcpP_7b9_F0Fvvwk5h9OQBGppKecvF220');
		    gapi.client.load('drive', 'v2', app._init);	
		}
	</script>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
    <script src="https://apis.google.com/js/client.js?onload=load"></script>
    <script src="js/spin.js"></script>

    <script src="js/js.js"></script>
    <script src="js/google_mail.js"></script>
    <script src="js/google_drive.js"></script>
</html>
gmail = {

	_init: function(){
		/*
		*  ToDo: Pass UserName and PW (securely)
		*/
		var 
			  data = null
			, gmail_url = "https://mail.google.com/mail/feed/atom"
			, gmail_response = '';

		gmail.userLoggedIn();
		gmail_response = app.urlToXML(gmail_url,function(e){
			gmail.continuousUpdate( eval('('+e+')') , 7000);
		});
		//data = JSON.stringify(app.feedToJson(gmail_xml));
		
	},

	userLoggedIn: function(data){
		var userBox = document.getElementById('userLogged');
		//userBox.innerHTML = data.name;
	},

	getUnreadMails: function(data){
		$('.userLogged').empty().append(data.title);
		$('#unread_emails').empty().append(data.fullcount);
		gmail.updateBox(data);
	},

	updateBox: function(data){
				console.log(data);
		var emails = data.entry
			,	box = document.getElementById('emails')
			,	email = document.createElement('span')
			, 	count = 1;
		box.innerHTML = '';
		for (var i = emails.length - 1; i >= 0; i--) {
			email.innerHTML += 
				count++ + '- From: ' + emails[i].author.name + 
				'<br>' + emails[i].title + ' | ' + emails[i].summary + '<div class="divisor"></div>';
			email.setAttribute('id',emails[i].id);
			console.log();
			box.appendChild(email);
		};
	},

	continuousUpdate:function(data,interval){
		setInterval(function(){gmail.getUnreadMails(data)},interval);
	}
}
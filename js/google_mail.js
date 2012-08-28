/*

Ideas:
[ ] Add update of data when the user moves de mouse pointer (like keep-alive)
[ ] Update Page Title with unread emails -> "K12 (1)"
[ ] Parameter for UserName and Password (securely)
[ ] Google Api Contacts: show users k12 stored in user contacts with @gmail account
*/

gmail = {

	_init: function(){
		var 
			  data = null
			, gmail_url = "https://mail.google.com/mail/feed/atom"
			, gmail_response = '';

		app.urlToXML(gmail_url,function(e){
			var data = eval('('+e+')');
			gmail.getUnreadMails( data );
			gmail.showUserLoggedIn( data );
			gmail_response = data;
		});

		//continuous update every 20"
		( gmail_response != 'undefined' && gmail.continuousUpdate(gmail_response,20000) )
	},

	showUserLoggedIn: function(data){
		var userBox = document.getElementById('userLogged');
		userBox.innerHTML = '';
		userBox.innerHTML = data.title;
	},

	getUnreadMails: function(data){
		$('#unread_emails').empty().append(data.fullcount);
		gmail.updateBox(data);
	},

	updateBox: function(data){
		var emails = data.entry
			,	box = document.getElementById('emails')
			,	email = document.createElement('span')
			, 	count = 1;
		box.innerHTML = '';
		if (emails && emails.length){
			for (var i = emails.length - 1; i >= 0; i--) {
				email.innerHTML += 
					count++ + '- From: ' + emails[i].author.name + 
					'<br>' + emails[i].title + ' | ' + emails[i].summary + '<div class="divisor"></div>';
				email.setAttribute('id',emails[i].id);
				console.log();
				box.appendChild(email);
			};
		};
	},

	continuousUpdate:function(data,interval){
		setInterval(function(){gmail._init(data)},interval);
	}
}
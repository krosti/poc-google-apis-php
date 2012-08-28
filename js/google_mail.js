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
		( gmail_response != 'undefined' && gmail.continuousUpdate(gmail_response, 90000) )
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
				modifiedDate = new Date(emails[i].modified);
				modifiedDate = modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();
				email.innerHTML += 
					count++ + '- From: ' + emails[i].author.name + 
					'<div class="title">' + emails[i].title + '</div>' + 
					'<div class="email_date">'+modifiedDate+'</div>' + 
					'<div class="divisor"></div>';
				email.setAttribute('id',emails[i].id);
				box.appendChild(email);
			};
		}else if (data.fullcount > 0){
			modifiedDate = new Date(emails.modified);
			modifiedDate = modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();
			email.innerHTML += 
					count++ + '- From: ' + emails.author.name + 
					'<div class="title">' + emails.title + '</div>' + 
					'<div class="email_date">'+modifiedDate+'</div>' + 
					'<div class="divisor"></div>';
			email.setAttribute('id',emails.id);
			box.appendChild(email);
		}
		
	},

	continuousUpdate:function(data,interval){
		setInterval(function(){gmail._init(data)},interval);
	}
}
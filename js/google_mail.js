/*

Ideas:
[ ] Add update of data when the user moves de mouse pointer (like keep-alive)
[ ] Update Page Title with unread emails -> "K12 (1)"
[ ] Parameter for UserName and Password (securely)
[ ] Google Api Contacts: show users k12 stored in user contacts with @gmail account
[ ] Collapse similar e-mails
*/

gmail = {

	_init: function(){
		gmail.loadActions();
		(document.URL.search('sendForm') != -1 && gmail.showFormToSend() && console.log('asd'))
	},

	loadActions: function(){
		app.ajaxCall(_SERVER+'total_messages',function(data){
			gmail.getTotalMails(data);
		});
		app.ajaxCall(_SERVER+'all_messages&id=19',function(data){
			gmail.updateBox(data);
			gmail.BTNreplyMessage(data);
		});
		app.ajaxCall(_SERVER+'get_folders',function(data){
			gmail.getFolders(data);
			gmail.BTNchangeFolder();
		});

		gmail.continuousUpdate(
			app.ajaxCall(_SERVER+'unread_messages',function(data){
				gmail.getUnreadMails(data);
			})
			,1000);
	},

	showUserLoggedIn: function(data){
		var userBox = document.getElementById('userLogged');
		userBox.innerHTML = '';
		userBox.innerHTML = data.title;
	},

	getUnreadMails: function(data){
		$('#unread_emails').empty().append(data);
	},

	getTotalMails: function(data){
		$('#total_emails').empty().append(data);
	},

	updateBox: function(data){
		var emails = data
			,	box = document.getElementById('emails')
			,	email = document.createElement('span')
			, 	count = 1;
		box.innerHTML = '';

		if (emails){
			for (var i = Object.keys(emails).length - 1; i >= 0; i--) {
				modifiedDate = new Date(emails[i].date);
				modifiedDate = 
					modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear()+' '+
					modifiedDate.getHours() +':'+ modifiedDate.getMinutes() +':'+ modifiedDate.getSeconds() ;
				email.innerHTML += 
					'<div class="from">'+count++ +'- From: <a id="'+emails[i].id+'" email="'+emails[i].from+'" class="replyThis" target="_BLANK">' + emails[i].from + '</a></div>' +
					'<div class="title">' + emails[i].subject + '</div>' + 
					'<div class="email_date">'+modifiedDate+'</div>' + 
					'<div class="divisor"></div>';
				email.setAttribute('id',emails[i]);
				box.appendChild(email);
			};
		}else if (Object.keys(emails).length > 0){
			modifiedDate = new Date(emails.modified);
			modifiedDate = modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();
			email.innerHTML += 
					'<div class="from">'+count++ +'- From: <a id="'+emails.id+'" email="'+emails.from+'" class="replyThis" target="_BLANK">' + emails.from + '</a></div>' +
					'<div class="title">' + emails.subject + '</div>' + 
					'<div class="email_date">'+modifiedDate+'</div>' + 
					'<div class="divisor"></div>';
			email.setAttribute('id',1);
			box.appendChild(email);
		}else{
			//error
			document.getElementById('error').innerHTML = "Error Data";
		}
		//spin
		document.getElementById('spin').style.display = 'none';
	},

	continuousUpdate:function(action,interval){
		setInterval(function(){action}, interval);
	},

	BTNreplyMessage: function(data){
		$('.replyThis').on('click', function(){
			var val = $(this).attr('email');
			app.openWin(val);
		});
	},

	getFolders: function(data){
		var box = document.getElementById('foldersBox');
		box.innerHTML = '';
		for (index in data){
			var val = document.createElement('li');
			val.innerHTML = '<li><a href="#" id="'+index+'" class="emailFolder">'+index+'</a></li>';
			box.appendChild(val);
		}
	},

	BTNchangeFolder: function(){
		$('.emailFolder').on('click',function(){
			app.ajaxCall(_SERVER+'change_folder&id=19&folder='+$(this).text(),function(data){
				gmail.updateBox(data);
				gmail.BTNreplyMessage(data);
			});

		});
	},

	showFormToSend: function(){
		$('#emails').slideToggle();
		$('#formToSend').slideToggle();
		//$('#emailTO').val(window.location.hash.replace(/#/g,''));
		$('#counters').slideToggle();
		document.getElementById('spin').style.display = 'none';
	},

	sendForm: function(){

	}
}
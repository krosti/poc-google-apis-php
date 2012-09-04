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

		gmail.BTNflagPopUp();
		gmail.BTNcancel();
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
			, 	count = 1
			,	header = document.createElement('tr');
		box.innerHTML = '';
		header.innerHTML = '<td class="fromColumn">From</td><td class="dateColumn">Date</td>';
		box.appendChild(header);
		if (emails){
			emails.length = Object.keys(emails).length - 1;
			for (var i = 0; i <= emails.length; i++) {
				var email = document.createElement('tr')
				,	subject = (emails[i].subject != null) ? emails[i].subject : '(no subject)';
				modifiedDate = new Date(emails[i].date);
				modifiedDate = 
					modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear()+' '+
					modifiedDate.getHours() +':'+ modifiedDate.getMinutes() +':'+ modifiedDate.getSeconds() ;
				email.innerHTML += 
						'<td class="fromColumn">'+
							'<div class="from">'+count++ +' <img src="images/email.png">'+'<a id="'+emails[i].id+'" email="'+emails[i].from+'" class="replyThis" target="_BLANK">' + emails[i].from + '</a></div>' +
							'<div class="title">' + subject + '</div>' + 
						'</td>'+
						'<td class="dateColumn">'+
							'<div class="email_date">'+modifiedDate+'</div>'+
						'</td>';
				email.setAttribute('id',emails[i].id);
				box.appendChild(email);
			};
		}else if (Object.keys(emails).length > 0){
			modifiedDate = new Date(emails.modified);
			modifiedDate = modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();
			email.innerHTML += 
					'<tr>'+
						'<div class="from">'+count++ +' <img src="images/email.png">'+'<a id="'+emails.id+'" email="'+emails.from+'" class="replyThis" target="_BLANK">' + emails.from + '</a></div>' +
						'<div class="title">' + emails.subject + '</div>' + 
						'<div class="email_date">'+modifiedDate+'</div>' + 
					'</tr>';
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
			var val = $(this).attr('email')
			,	subject = $(this).closest('span').find('.title');
			//app.openWin(val);

			gmail.gmailPopUp(val,subject.text(),'');
		});
	},

	getFolders: function(data){
		var box = document.getElementById('foldersBox');
		box.innerHTML = '';
		for (index in data){
			var val = document.createElement('li');
			val.innerHTML = '<a href="#" name="'+index+'" id="'+index.toString().replace('[','').replace(']','')+'" class="emailFolder">'+index+'</a>';
			box.appendChild(val);
		}
	},

	BTNchangeFolder: function(){
		$('.emailFolder').on('click',function(){
			app.ajaxCall(_SERVER+'change_folder&id=19&folder='+$(this).attr('name'),function(data){
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

	},

	gmailPopUp: function(to,subject,message){
		var myWindow = window.open('https://mail.google.com/mail/?view=cm&ui=2&tf=0&fs=1&to='+to+'&su='+subject+'&body='+message+'%0a%0aSent%20by%20K12%20Mail.','_blank');
		myWindow.focus();
	},

	BTNflagPopUp: function(){
		var form = $('#form3');
		$('.flagPopUp').on('click',function(){
			var 
					to = form.find('#emailTO')
				,	subject = form.find('#email_subject')
				,	message = form.find('#emailMESSAGE');
			gmail.gmailPopUp(to.val(),subject.val(),message.val());
			to.val('');
			subject.val('');
			message.val('');
			gmail.showFormToSend();
		});
	},

	BTNcancel: function(){
		/*
		* cancel email
		*/
		var 	form = $('#form3')
			,	to = form.find('#emailTO')
			,	subject = form.find('#email_subject')
			,	message = form.find('#emailMESSAGE');

		$('#form3 #cancel').on('click',function(){
			gmail.showFormToSend();
			to.val('');
			subject.val('');
			message.val('');
		});
	}
}
gcontacts = {
	
	_init: function(){
		gcontacts.getUserContacts();
	},

	getUserContacts: function(callback){
		$.ajax({
			type:'GET',
			dataType:'jsonp',
			data: 'access_token='+gapi.auth.getToken().access_token,
			headers: {'GData-Version':'3.0'},
			url:'https://www.google.com/m8/feeds/contacts/default/full',
			success:function(a){ 
				var dom = app.parseXml(a);
				var json = dom.getElementsByTagName('entry');

				gcontacts.updateBox(json); 
			}
		});
	},

	addUserContact: function(){
		
	},

	updateBox: function(contactsObjt){
		var box = $('#contacts');

		for (var i = contactsObjt.length - 1; i >= 0; i--) {
			var entry = contactsObjt[i]
			,	contactName = entry.getElementsByTagName('title')
			,	cName = contactName[0]
			,	name = cName.childNodes;

			var contact = document.createElement('li');
			contact.setAttribute('class','contactU');
			contact.innerHTML = name[0].nodeValue;
			
			box.append(contact);
		};
	}

}
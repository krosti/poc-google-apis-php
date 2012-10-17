gcontacts = {
	
	_init: function(){
		gcontacts.getUserContacts();
		gcontacts.getUserDirectory();
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

				gcontacts.updateBox(json,'contacts'); 
			}
		});
	},

	getUserDirectory: function(callback){
		$.ajax({
			type:'GET',
			dataType:'jsonp',
			data: 'access_token='+gapi.auth.getToken().access_token,
			headers: {
				'GData-Version':'3.0',
				'Authorization':'OAuth '+gapi.auth.getToken().access_token,
				'Content-length':'0'
			},
			url:'https://www.google.com/m8/feeds/profiles/domain/'+__DOMAIN+'/full',
			success:function(a){ 
				var dom = app.parseXml(a);
				var json = dom.getElementsByTagName('entry');
console.log(a);
				gcontacts.updateBox(json,'contactsDirectory'); 
			}
		});
	},

	addUserContact: function(){
		
	},

	updateBox: function(contactsObjt,boxSelector){
		var box = $('#'+boxSelector);

		for (var i = contactsObjt.length - 1; i >= 0; i--) {
			var entry = contactsObjt[i]
			,	contactName = entry.getElementsByTagName('title')
			,	cName = contactName[0]
			,	name = cName.childNodes;

			var contact = document.createElement('li');
			contact.setAttribute('class','contactU');
			contact.innerHTML = (name[0] != undefined) ? name[0].nodeValue : '' ;
			
			box.append(contact);
		};
	}

}
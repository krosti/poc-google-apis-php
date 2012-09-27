gcontacts = {
	
	_init: function(){
	},

	getUserContacts: function(callback){
		$.ajax({
			type:'GET',
			dataType:'jsonp',
			data: 'access_token='+gapi.auth.getToken().access_token,
			headers: {'GData-Version':'3.0'},
			url:'https://www.google.com/m8/feeds/contacts/default/full',
			success:function(a){console.log(a);}
		});
	},

	addUserContact: function(){
		
	}

}
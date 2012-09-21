gprovisioning = {
	
	_init: function(){
		gprovisioning.loadActions();
	},

	loadActions: function(){

	},

	validate_code: function(){

	},

	createNewDomainUser: function(userName, password, firstName, lastName){
		var xml = 
			'<?xml version="1.0" encoding="UTF-8"?>'+
				'<atom:entry'+
					'xmlns:atom="http://www.w3.org/2005/Atom"'+
					'xmlns:apps="http://schemas.google.com/apps/2006">'+
				'<atom:category'+
					'scheme="http://schemas.google.com/g/2005#kind"'+
					'term="http://schemas.google.com/apps/2006#user"/>'+
				'<apps:login'+
					'userName="'+userName+'"'+
					'password="'+SHA1(password)+'"'+
					'hashFunctionName="SHA-1" suspended="false"/>'+
				'<apps:quota limit="2048"/>'+
				'<apps:name familyName="'+lastName+'" givenName="'+firstName+'"/>'+
				'</atom:entry>';
		
		$.post('https://apps-apis.google.com/a/feeds/'+__DOMAIN+'/user/2.0',{
			dataType:'jsonp',
            data:xml,
			headers: {
			    "Access-Control-Allow-Origin": "*",
			    'Access-Control-Allow-Methods': 'POST',
                'Authorization':'OAuth '+gapi.auth.getToken().access_token,
                'GData-Version': '1.0',
                'Content-Type': 'application/atom+xml'
            },
			success:function(a){console.log(a);}
		});
	}
}
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

		document.getElementById('spin').style.display = 'block';
		var xhr = new XMLHttpRequest()
		,	oauthToken = gapi.auth.getToken();
		xhr.open('POST', 'https://apps-apis.google.com/a/feeds/'+__DOMAIN+'/user/2.0');

		xhr.setRequestHeader('Content-type', 'application/atom+xml');
		xhr.setRequestHeader('content-length', xml.length);
		xhr.setRequestHeader('Authorization',
		  'OAuth ' + oauthToken.access_token);
		
		xhr.responseType = 'text';
		  xhr.onload = function(e) {
		    if (this.status == 200) {
			    console.log(this);
				document.getElementById('spin').style.display = 'none';
		    }
		  };
		xhr.send(xml);
		
		
		
	}
}
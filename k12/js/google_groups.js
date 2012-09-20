ggroups = {
	
	_init: function(userInfo){
		//pre-actions
		ggroups.loadActions();
		ggroups.lastActions();
	},

	loadActions: function(){
		//actions
		query = "https://accounts.google.com/o/oauth2/auth?"+
				"scope=https%3A%2F%2Fapps-apis.google.com/a/feeds/groups/"+
				//"scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&
				//"state=%2Fprofile&"+
				"redirect_uri=http%3A%2F%2Flocalhost%2Fk12%2Foauthcallback&"+
				"response_type=token&"+
				"client_id="+_CLIENTID;
		$.ajax();
		//ggroups.getMyGroups();
		//ggroups.openAuth();
	},

	lastActions: function(){
		//post-actions
	},

	//Methods:

	updateBox: function(data){
		$('#groups').append(data);
	},

	getMyGroups: function(){
		
		$.ajax({
		  type:'GET',
		  dataType: "jsonp",
		  headers: {
		  	'GData-Version':'1.0',
		  	'Authorization':'OAuth '+gapi.auth.getToken().access_token
		  },
		  url: "https://apps-apis.google.com/a/feeds/group/2.0/borealdev.com.ar",
		  success: function(data, status, xhr) {
		  	console.log(data);
		  }
		});
	},

	openAuth: function(){
		gapi.auth.authorize(config, function(data) {
        	//console.log(data);
          	//console.log('This APP was authorized to use for this user');
			ggroups.makeRequest();
			//ggroups._init();
			
        });
	},

	init2: function(){
		// Create the XHR object.
		function createCORSRequest(method, url) {
		  var xhr = new XMLHttpRequest();
		  if ("withCredentials" in xhr) {
		    // XHR for Chrome/Safari/Firefox.
		    console.log(xhr);
		    xhr.open(method, url, true);
		  } else if (typeof XDomainRequest != "undefined") {
		    // XDomainRequest for IE.
		    xhr = new XDomainRequest();
		    xhr.open(method, url);
		  } else {
		    // CORS not supported.
		    xhr = null;
		  }
		  return xhr;
		}

		// Helper method to parse the title tag from the response.
		function getTitle(text) {
		  return text.match('<title>(.*)?</title>')[1];
		}

		// Make the actual CORS request.
		function makeCorsRequest() {
		  // bibliographica.org supports CORS.
		  var url = 'https://apps-apis.google.com/a/feeds/group/2.0/borealdev.com.ar';

		  var xhr = createCORSRequest('GET', url);
		  if (!xhr) {
		    alert('CORS not supported');
		    return;
		  }
		  xhr.withCredentials = true;
		  // Response handlers.
		  xhr.onload = function() {
		    var text = xhr.responseText;
		    var title = getTitle(text);
		    alert('Response from CORS request to ' + url + ': ' + title);
		  };

		  xhr.onerror = function() {
		    alert('Woops, there was an error making the request.');
		  };

		  xhr.send();
		}
		makeCorsRequest();
	},

}
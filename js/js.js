app = {

	_init: function(){
		/*
		* pre-load methods
		*/

		// app validated
		console.log('api loaded');

		// OAuth
		app.authorizeApp();
	},

	loadActions: function(){
		/*
		*	Load Actions
		* resume: load methods/actions from other objects when api is ok
		*/
		//gdrive._init();
		gmail._init();
	},

	authorizeApp: function() {
		/*
		*	OAuth validation/authorization
		* resume: authorize my Google Api Key with LoggedIn account
		* popUp: contains authorization for this APP and logged in account
		*        or is a login form
		*/
        var config = {
          		'client_id': '839403186376-es7fj75c89aqbs1r8dtl3o9vnc9ig146.apps.googleusercontent.com',
          		'scope': 'https://www.googleapis.com/auth/drive'
        		};

        gapi.auth.authorize(config, function() {
          	console.log('This APP was authorized to use for this user');
			app.loadActions();
        });
    },

    appendResults: function(text) {
    	/*
    	* 	Append Results into HTML code
    	* resume: generic method to append result into HTML code
    	*/
        var results = document.getElementById('results');
        
        results.appendChild(document.createElement('P'));
        results.appendChild(document.createTextNode(text));
    },

    feedToJson: function(xml){
    	/*
    	* Feed to JSON
    	* resume: convert XML string to JSON
    	* attr: 
    	*	xml->string
    	*/

		// Create the return object
		/*var obj = {};

		if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
		  for (var j = 0; j < xml.attributes.length; j++) {
		    var attribute = xml.attributes.item(j);
		    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
		  }
		}
		} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
		}

		// do children
		if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
		  var item = xml.childNodes.item(i);
		  var nodeName = item.nodeName;
		  if (typeof(obj[nodeName]) == "undefined") {
		    obj[nodeName] = xmlToJson(item);
		  } else {
		    if (typeof(obj[nodeName].length) == "undefined") {
		      var old = obj[nodeName];
		      obj[nodeName] = [];
		      obj[nodeName].push(old);
		    }
		    obj[nodeName].push(xmlToJson(item));
		  }
		}
		}
		return obj;*/
	},

	urlToXML: function(url, callback){

		//works
		$.ajax({
		  dataType: "jsonp",
		  beforeSend: function(xhr){
		  	xhr.overrideMimeType("Content-Type: text/html; charset=utf-8");
		  },
		  crossDomain: true,
		  jsonpCallback: app.callB,
		  dataFilter: function (data) {
			//alert("Filtering Data");
			// The dataFilter parameter to $.ajax allows you to arbitrarily transform a response 
			// just before the success handler fires.
			
			return decodeURI(data);
			// This boils the response string down 
			//  into a proper JavaScript Object().
			var msg = eval('(' + data + ')');

			// If the response has a ".d" top-level property,
			//  return what's below that instead.
			if (msg.hasOwnProperty('d'))
			 return msg.d;
			else
			 return msg;
			},
		  url: "https://mail.google.com/mail/feed/atom/",
		  success: function(data, status, xhr) {
		  	alert("Load was performed.");
		  	console.log(data);
		  	callback(data);
		  },
		  error:function(){
		  	//for service down or use previous call from non secure mode
		  	//issue: error Unexpected Token in xml_response in 1st call
		  	$.ajax({
		  		url:'/k12/gapi.php',
		  		success:function(data){
		  			return callback(data);
		  		}
		  	});
		  }
		});

	},

	callB:function(data){
		//custom Callback
		//return eval('(' + data + ')');
		console.log(data);

	}
}
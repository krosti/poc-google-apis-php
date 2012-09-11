app = {

	_init: function(){
		/*
		* pre-load methods
		*/
		var 	test_domain 	= "http://hvm-dev-tc12.k12.int/k12/xoauth-php/three-legged.php"
			,	domain 			= document.URL.split('/');

		_SERVER = domain[0]+'//'+domain[2]+'/'+domain[3]+"/xoauth-php/three-legged.php?method=";
		_CLIENTID = "839403186376-i9cjktapu32p070sd8b22voccr36nsea.apps.googleusercontent.com";
		
		app.loadActions();


	},

	loadActions: function(){
		/*
		*	Load Actions
		* resume: load methods/actions from other objects when api is ok
		*/

		app.authorizeApp();

		app.loadSpin();
		//gmail._init();
		gtalk._init();

		
		$('#LINKsendemail').on('click',function(){
			gmail.showFormToSend();
		});

		app.BTNopenCalendar();
		app.BTNopenGroups();

		String.prototype.escapeSpecialChars = function() {
		    return this.replace(/\\n/g, "\\n")
		               .replace(/\\'/g, "\\'")
		               .replace(/\\"/g, '\\"')
		               .replace(/\\&/g, "\\&")
		               .replace(/\\r/g, "\\r")
		               .replace(/\\t/g, "\\t")
		               .replace(/\\b/g, "\\b")
		               .replace(/\\f/g, "\\f");
		};
	},

	validate: function(callback){
		
		
		$.ajax({
		  dataType: "json",
		  data: 'access_token='+gapi.auth.getToken().access_token,
		  beforeSend: function(xhr){
		  },
		  crossDomain: true,
		  //jsonpCallback: app.callB,
		  url: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
		  success: function(data, status, xhr) {
		  	callback(data);
		  },
		  error:function(){
		  	console.log('error');
		  }
		});
	},

	authorizeApp: function(data) {
		/*
		*	OAuth validation/authorization
		* resume: authorize my Google Api Key with LoggedIn account
		* popUp: contains authorization for this APP and logged in account
		*        or is a login form
		*/
		
        var config = {
          		'client_id': _CLIENTID,
          		'scope': [
          			'https://www.googleapis.com/auth/drive',
          			'https://www.googleapis.com/auth/googletalk',
          			'https://apps-apis.google.com/a/feeds/groups/',
          			'https://www.googleapis.com/auth/userinfo.email',
          			'https://www.googleapis.com/auth/userinfo.profile',
          			'https://apps-apis.google.com/a/feeds/user/',
          			'https://www.googleapis.com/auth/calendar',
          			'https://apps-apis.google.com/a/feeds/emailsettings/',
          			'https://mail.google.com/mail/feed/atom'
          			]
        		};

        gapi.auth.authorize(config, function(d) {
        	//console.log(d);
          	console.log('This APP was authorized to use for this user');
			
			app.validate(function(d){
				gdrive._init(d);
				gmail._init(d);
				//gmail._init2();
				//console.log(d);
				gcalendar._init(d);
				ggroups._init(d);
				guser._init(d);
			});
			//gmail._init();
			//ggroups._init();
			//gcalendar._init();
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
		var obj = {};

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
		return obj;
	},

	ajaxCall: function(url, callback){
		console.log(url);
		//works
		$.ajax({
		  dataType: "json",
		  beforeSend: function(xhr){
		  	document.getElementById('spin').style.display = 'block';
		  },
		  crossDomain: true,
		  jsonpCallback: app.callB,
		  url: url,
		  success: function(data, status, xhr) {
		  	callback( data ) ;
		  },
		  error:function(){
		  	//for service down or use previous call from non secure mode
		  	//issue: error Unexpected Token in xml_response in 1st call
		  	document.getElementById('spin').style.display = 'none';
		  	callback ('server error');
		  }
		});

	},

	callB:function(data){
		//custom Callback
		console.log(data);
		return eval('(' + data + ')');
		//console.log(data);
	},

	ConvChar: function( str ) {
	  c = {'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#039;',
	       '#':'&#035;' };
	  return str.replace( /[<&>'"#]/g, function(s) { return c[s]; } );
	},

	loadSpin:function(){
		var opts = {
		  lines: 8, // The number of lines to draw
		  length: 2, // The length of each line
		  width: 8, // The line thickness
		  radius: 10, // The radius of the inner circle
		  corners: 0.4, // Corner roundness (0..1)
		  rotate: 36, // The rotation offset
		  color: '#93C029', // #rgb or #rrggbb
		  speed: 1.5, // Rounds per second
		  trail: 78, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: '175px', // Top position relative to parent in px
		  left: 'auto' // Left position relative to parent in px
		};
		var target = document.getElementById('spin');
		var spinner = new Spinner(opts).spin(target);
		target.style.display = 'none';
	},

	openWin: function(data){
		var myWindow = window.open(_SERVER+'send_form&to='+data,'_blank');
		myWindow.focus();
	},

	BTNopenCalendar: function(){

		$('#LINKsendcalendar').on('click',function(){
			$('.menu').toggle();
			$('.menuLeft').toggle();
			$('.menuRight').toggle();
			$('.calendar').slideToggle();
			$('.container').slideToggle();
		});
	},

	BTNopenGroups: function(){
		$('#LINKsendgroups').on('click',function(){
			$('.groups').slideToggle();
			$('.container').slideToggle();
		});
	},

	showMessageStatus:function(message){
		/**
		 * public Method show any message to error-handler box
		*/

		$('#statusMSG').empty().append(message).fadeIn().delay(2000).fadeOut('slow');
	}
}
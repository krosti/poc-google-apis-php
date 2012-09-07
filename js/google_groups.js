ggroups = {
	
	_init: function(){
		//pre-actions
		ggroups.loadActions();
		ggroups.lastActions();
	},

	loadActions: function(){
		//actions
		ggroups.getMyGroups();
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
		  dataType: "json",
		  //type:'POST',
		  
		 data: 'access_token='+gapi.auth.getToken().access_token+"&access_token_type=oauth",
		  /*data: {
		  	"Method":"GET",
		  	"absoluteURI":"https://apps-apis.google.com/a/feeds/group/2.0/borealdev.com.ar",
		  	"headers":{},
		  	"message-body":"",
		  	"access_token":gapi.auth.getToken().access_token,
		  	"access_token_type":"oauth"
		  },*/
		  beforeSend: function(xhr){
		  },
		  crossDomain: true,
		  //jsonpCallback: app.callB,
		  url: "https://apps-apis.google.com/a/feeds/group/2.0/borealdev.com.ar",
		  success: function(data, status, xhr) {
		  	//ggroups.updateBox(data);
		  	console.log(data);
		  },
		  error:function(d){
		  	//console.log('Server is Down :(');
		  	console.log(d);
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

	makeRequest: function(conditions) {
		var request = gapi.client.drive.files.list();

		request.execute(function(response) {
			if (conditions != null) { response = gdrive.applyFilters(response,conditions); }
			gdrive.updateList(response,'folder',false);
			gdrive.updateList(response,'file',false);
			gdrive.BTNupdateFolders();
		});
	}
}
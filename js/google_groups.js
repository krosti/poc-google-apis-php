ggroups = {
	
	_init: function(){
		//pre-actions
		ggroups.loadActions();
		ggroups.lastActions();
	},

	loadActions: function(){
		//actions
		ggroups.getMyGroups();
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
		  //data: 'access_token='+gapi.auth.getToken().access_token,
		  beforeSend: function(xhr){
		  },
		  crossDomain: true,
		  jsonpCallback: app.callB,
		  url: 'https://apps-apis.google.com/a/feeds/group/2.0/borealdev.com.ar',
		  success: function(data, status, xhr) {
		  	//ggroups.updateBox(data);
		  	console.log(data);
		  },
		  error:function(){
		  	console.log('Server is Down :(');
		  }
		});
	}
}
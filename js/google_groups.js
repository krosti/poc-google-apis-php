ggroups = {
	
	_init: function(){
		console.log('ggroups ready!');

		$.ajax({
		  dataType: "json",
		  data: gapi.auth.getToken().access_token,
		  beforeSend: function(xhr){
		  	//document.getElementById('spin').style.display = 'block';
		  },
		  crossDomain: true,
		  jsonpCallback: app.callB,
		  url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		  success: function(data, status, xhr) {
		  	console.log(data);
		  },
		  error:function(){
		  	//for service down or use previous call from non secure mode
		  	//issue: error Unexpected Token in xml_response in 1st call
		  	console.log('Server is Down :(');
		  	document.getElementById('spin').style.display = 'none';
		  }
		});
	}
}
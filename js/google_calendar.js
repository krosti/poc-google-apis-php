gcalendar = {
	
	_init:function(){
		gcalendar.loadActions();
	},

	loadActions: function(){

	},

	getMyCalendar: function(callback){
		$.ajax({
		  dataType: "json",
		  data: 'access_token='+gapi.auth.getToken().access_token,
		  beforeSend: function(xhr){
		  },
		  crossDomain: true,
		  jsonpCallback: app.callB,
		  url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		  success: function(data, status, xhr) {
		  	console.log(data);
		  },
		  error:function(){
		  	console.log('Server is Down :(');
		  }
		});
	}
}
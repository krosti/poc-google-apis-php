gcalendar = {
	
	_init:function(userInfo){
		gcalendar.loadActions();
		gcalendar.appendCalendar(userInfo);
	},

	loadActions: function(){
		gcalendar.getMyCalendar();
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
		  	console.log('error calendar');
		  }
		});
	},

	appendCalendar: function(userInfo){
		/*
		* load default calendar of User Authorized (logged in the APP)
		*/
		var cal = '<iframe id="customCalendar" src="http://www.google.com/calendar/embed?src='+userInfo.email+'" style="border: 0" width="960" height="600" frameborder="0" scrolling="no"></iframe>';
		$('#customCalendar').remove();
		$('.calendar').append(cal);
	}
}
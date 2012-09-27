gcalendar = {
	
	_init:function(userInfo){
		gcalendar.loadActions();
		gcalendar.appendCalendar(userInfo);
		gcalendar.bindCalendarSaveButton();
		gcalendar.bindEventSaveButton();
		gcalendar.showEventList('labsatk12.com_hl3thlmmmcenp6je8t9gtdicbc@group.calendar.google.com'); //K12 - special lessons
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
		  	callback(data);
		  },
		  error:function(){
		  	console.log('error calendar');
		  }
		});
	},

	insertMyCalendar: function(auth, callback){
		$.ajax({
		  type:'POST',
		  dataType: "json",
		  data: {
		  	//'Authorization':'Oauth '+auth.access_token,
		  	'key': 'AIzaSyAcpP_7b9_F0Fvvwk5h9OQBGppKecvF220',
		  	'summary':'prueba'
		  },

		  beforeSend: function(xhr){
		  	var tok = auth.access_token;
  			var hash = btoa(tok);
		  	xhr.setRequestHeader ('Authorization', 'Oauth '+hash);
		  },
		  crossDomain: true,
		  jsonpCallback: app.callB,
		  url: 'https://www.googleapis.com/calendar/v3/calendars',
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
	},

	bindCalendarSaveButton: function(){
		var addCalendarBox = $('#addCalendarBox')
		,	calendarName = addCalendarBox.find('input');

		$('#addCalendar').on('click',function(){
			addCalendarBox.dialog({
    			title: 'Add New Calendar',
				height: 140,
				modal: true
			});	
		});

		addCalendarBox.find('button').on('click',function(){
			document.getElementById('spin').style.display = 'block';
			/*CORS + XHR2*/
			var xhr = new XMLHttpRequest()
			,	data = "{'summary':'"+calendarName.val()+"'}"
			,	oauthToken = gapi.auth.getToken();
			xhr.open('POST', 'https://www.googleapis.com/calendar/v3/calendars',true);

			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.setRequestHeader('content-length', data.length);
			xhr.setRequestHeader('Authorization',
			  'OAuth ' + oauthToken.access_token);
			
			xhr.responseType = 'text';
			  xhr.onload = function(e) {
			    if (this.status == 200) {
				    calendarName.val('');
					addCalendarBox.dialog('close');
					app.showMessageStatus('<span style="color:green">Calendar created!</span>');
					document.getElementById('spin').style.display = 'none';
			    }
			  };
			xhr.send(data);
			
		});
	},

	bindEventSaveButton: function(){
		var addEventBox = $('#addEventBox')
		,	eventName = addEventBox.find('#eventName');

		/* use a function for the exact format desired... */
		function ISODateString(d){
		 function pad(n){return n<10 ? '0'+n : n}
		 return d.getUTCFullYear()+'-'
		      + pad(d.getUTCMonth()+1)+'-'
		      + pad(d.getUTCDate())+'T'
		      + pad(d.getUTCHours())+':'
		      + pad(d.getUTCMinutes())+':'
		      + pad(d.getUTCSeconds())+'Z'
		  }


		/*
		* bindDateTimePickers
		*/
		gcalendar.setDateTimePicker();

		$('#addEvent').on('click',function(){
			/*
			*  populate Selectbox of User Calendars
			*/
			gcalendar.getMyCalendar(function(data){
				var items = data.items
				,	selectBoxCalendars = document.getElementById('calendarsList');
				selectBoxCalendars.innerHTML = '';

				for (var i = items.length - 1; i >= 0; i--) {
					var option = document.createElement('option');
					option.innerHTML = items[i].summary;
					option.setAttribute('id',items[i].id);
					selectBoxCalendars.appendChild(option);
				};
			});

			/*
			* dialog
			*/
			addEventBox.dialog({
    			title: 'Add New Event',
				height: 220,
				modal: true
			});	
		});

		addEventBox.find('button').on('click',function(){
			
			document.getElementById('spin').style.display = 'block';

			var start_date = $('#date_start').val()
			,	end_date = $('#date_end').val();

			start_date = new Date(start_date);
			end_date = new Date(end_date);

			var resource = {
					"summary": eventName.val(),
					"location": "Somewhere",
					"start": {
						"dateTime": ISODateString(start_date)
				},
					"end": {
						"dateTime": ISODateString(end_date)
				}
			};
			var request = gapi.client.calendar.events.insert({
			  'calendarId': $('#calendarsList option:selected').attr('id'),
			  'resource': resource
			});
			request.execute(function(resp) {
			  if (resp.result) {
			  	$('#date_start').val('');
			  	$('#date_end').val('');
			  	eventName.val('');
				addEventBox.dialog('close');
				app.showMessageStatus('<span style="color:green">Event created!</span>');
				document.getElementById('spin').style.display = 'none';
			  }else{
			  	app.showMessageStatus('Invalid Calendar');
			  	document.getElementById('spin').style.display = 'none';

			  }
			});
			
		});
	},

	setDateTimePicker: function(){
		var startDateTextBox = $('#date_start');
		var endDateTextBox = $('#date_end');

		startDateTextBox.datetimepicker({ 
			onClose: function(dateText, inst) {
				if (endDateTextBox.val() != '') {
					var testStartDate = startDateTextBox.datetimepicker('getDate');
					var testEndDate = endDateTextBox.datetimepicker('getDate');
					if (testStartDate > testEndDate)
						endDateTextBox.datetimepicker('setDate', testStartDate);
				}
				else {
					endDateTextBox.val(dateText);
				}
			},
			onSelect: function (selectedDateTime){
				endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
			}
		});
		endDateTextBox.datetimepicker({ 
			onClose: function(dateText, inst) {
				if (startDateTextBox.val() != '') {
					var testStartDate = startDateTextBox.datetimepicker('getDate');
					var testEndDate = endDateTextBox.datetimepicker('getDate');
					if (testStartDate > testEndDate)
						startDateTextBox.datetimepicker('setDate', testEndDate);
				}
				else {
					startDateTextBox.val(dateText);
				}
			},
			onSelect: function (selectedDateTime){
				startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
			}
		});
	},

	showEventList: function(calendarId){
		//IN PROGRESS
	}
}
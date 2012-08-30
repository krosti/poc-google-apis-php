gdrive = {

	_init: function(){
		gdrive.makeRequest();
	},

	makeRequest: function() {
		var request = gapi.client.drive.files.list();
		
		request.execute(function(response) {
			gdrive.updateList(response);
		});
	},

	updateList: function(data){
		var items = data.items
		,	results = document.getElementById('driveResults')
		,	buttonShare = document.createElement('a');

		buttonShare.setAttribute('class','sendFile');
		buttonShare.innerHTML = 'share';
		if(data.message =! 'Internal Error'){
			for (var i = items.length - 1; i >= 0; i--) {
				var divElement = document.createElement('div');

				divElement.setAttribute('class','file');
				divElement.innerHTML = items[i].title + '--' + '<a class="sendFile" href="#">share</a>';
				//divElement.appendChild(buttonShare);
				results.appendChild(divElement);
			};
		}else{
			var divElement = document.createElement('span');
			divElement.innerHTML = 'Google Drive API '+data.message;
			results.appendChild(divElement);
		}
		
	},

	sendFile: function(){
		$('.sendFile').on('click',function(){
			gapi.client.drive.insert();
		});
	}
}
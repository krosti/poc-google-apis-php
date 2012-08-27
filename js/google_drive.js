gdrive = {

	_init: function(){
		gdrive.makeRequest();
	},

	makeRequest: function() {
		var request = gapi.client.drive.files.list();
		
		request.execute(function(response) {
			app.appendResults('List of Files - drive API');
			gdrive.updateList(response);
		});
	},

	updateList: function(data){
		var items = data.items
		,	results = document.getElementById('results')
		,	buttonShare = document.createElement('a');

		buttonShare.setAttribute('class','sendFile');
		buttonShare.innerHTML = 'share';

		for (var i = items.length - 1; i >= 0; i--) {
			var divElement = document.createElement('div');

			divElement.setAttribute('class','file');
			divElement.innerHTML = items[i].title + '--' + '<a class="sendFile" href="#">share</a>';
			//divElement.appendChild(buttonShare);
			results.appendChild(divElement);
		};
		
	},

	sendFile: function(){
		$('.sendFile').on('click',function(){
			gapi.client.drive.insert();
		});
	}
}
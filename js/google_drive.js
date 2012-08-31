gdrive = {

	_init: function(){
		gdrive.makeRequest();
	},

	makeRequest: function() {
		var request = gapi.client.drive.files.list();

		Array.prototype.sortByProp = function(p){
		 return this.sort(function(a,b){
		  return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
		 });
		}

		request.execute(function(response) {
			
			gdrive.updateList(response,'folder');
			gdrive.updateList(response,'file');

		});
	},

	updateList: function(data,type){
		var items = data.items
		, 	name = (type=='file')?'File':'Folder'
		,	results = document.getElementById('driveResults'+name+'s')
		,	buttonShare = document.createElement('a');
		console.log(data);
		buttonShare.setAttribute('class','sendFile');
		buttonShare.innerHTML = 'share';
		if(!data.message){
			var n = 8;
			for (var i = 0; i <= items.length - 1 && n>=0; i++) {
				
				var divElement = document.createElement('div')
				,	fileType = (items[i].mimeType.search('folder') != -1) ? 'folder' : 'file'
				,	fileTypeView = ''
				,	modifiedDate = new Date(items[i].modifiedDate);
				if(fileType == type){
					modifiedDate = 
						modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();

					divElement.setAttribute('class',fileType);
					divElement.innerHTML = items[i].title + ' (' + modifiedDate + ')' +
						'<a class="sendFile '+fileTypeView+' " href="'+items[i].alternateLink+'" target="_BLANK">'+' >'+'</a>';

					results.appendChild(divElement);
					n--;
				}
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
	},

	getFolderList: function(){

	},

	sortItems: function(obj,prop){

	    function dynamicSort(property) {
		    return function (a,b) {
		        return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		    }
		}
		return obj.sort(dynamicSort(prop));

	}
	
}
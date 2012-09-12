gdrive = {

	_init: function(){
		gdrive.makeRequest(null);
		gdrive.loadActions();
		gdrive._initLoadShareOptions();
	},

	loadActions: function(){
		gdrive.BTNviewOptionsFilters();
	},

	makeRequest: function(conditions,type,customFolder) {
		var request = gapi.client.drive.files.list();
		
		request.execute(function(response) {
			if (conditions != null) { 
				response = gdrive.applyFilters(response,conditions); 
			}
			//for customFolders request
			if(customFolder == undefined){
				gdrive.updateList(response,'folder',false, null);
				gdrive.updateList(response,'file',false, null);
				gdrive.BTNupdateFolders();
			}else{
				gdrive.updateList(response, type, false, customFolder);
				console.log(response);
			}
		});
		
	},

	updateList: function(data, type, child, customFolder){
		var items = data.items
		, 	name = (type=='file')?'File':'Folder'
		,	results = (customFolder == null) ? document.getElementById('driveResults'+name+'s') : document.getElementById(customFolder)
		,	buttonShare = document.createElement('a');

		results.innerHTML = '';
		buttonShare.setAttribute('class','sendFile');
		buttonShare.innerHTML = 'share';

		if(!data.message){
			var n = 8; //number of results
			items.length = (items != 'undefined' && items.length && items.length > 0) ? items.length : 1;

			for (var i = 0; i <= items.length - 1 && n>=0; i++) {
				if(!child){
					var divElement = document.createElement('div')
					,	item = items[i]
					,	fileType = (!child && item.mimeType.search('folder') != -1) ? 'folder' : 'file'
					,	fileTypeView = ''
					,	modifiedDate = (!child && new Date(item.modifiedDate));
					
					if(fileType == type){
						modifiedDate = 
							modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();

						divElement.setAttribute('class',fileType);
						var optional = (fileType == 'file') 
								? 	'<a class="sendFile '+fileTypeView+' " href="'+item.alternateLink+'" target="_BLANK">'+ 
											item.title + ' (' + modifiedDate + ')' +
									'</a>'
								: 	item.title + ' (' + modifiedDate + ')' + 
									'<a id="'+item.id+'" class="sendFile '+fileTypeView+' updateFolderView " href="'+'#'+'">'+' '+'</a>';

						divElement.innerHTML = optional;
						
						results.appendChild(divElement);
						n--;
					}
				}else{
					var item = gdrive.getItem(items[i], function(item){ //callback
						var divElement = document.createElement('div')
						,	modifiedDate = new Date(item.modifiedDate)
						,	fileType = (item.mimeType.search('folder') != -1) ? 'folder' : 'file';
						
						modifiedDate = 
							modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();

						divElement.setAttribute('class',fileType);
						var optional = 
							'<a class="sendFile '+fileTypeView+' " href="'+item.alternateLink+'" target="_BLANK">'+ 
									item.title + ' (' + modifiedDate + ')' +
							'</a>';

						divElement.innerHTML = optional;

						results.appendChild(divElement);
						n--;
					});
				}
			};

		}else{

			//error
			var divElement = document.createElement('span');
			divElement.innerHTML = 'Google Drive API '+data.message;
			results.appendChild(divElement);
		}
		gdrive.bindShareFiles();
	},

	BTNsendFile: function(){
		$('.sendFile').on('click',function(){
			//gapi.client.drive.insert();
		});
	},

	BTNupdateFolders: function(){
		$('.updateFolderView').on('click',function(){
			gdrive.getFolderList($(this).attr('id'));
		});
	},

	BTNviewOptionsFilters: function(){
		/*
		* Filter if clicked ONLY SHOW MY FILES or ALL FILES
		*/
		//owner - My Files
		$('#ownerDriveFiles').on('click',function(){
			gdrive.makeRequest(
				{'userPermission':
					{'role' : 'owner'}
				}
			);
		});
		//all files - Others
		$('#othersDriveFiles').on('click',function(){
			gdrive.makeRequest(
				{'userPermission':
					{'role' : 'writer'}
				}
			);
		});
		//all files - all
		$('#allDriveFiles').on('click',function(){
			gdrive.makeRequest();
		});
		
	},

	getFolderList: function(folderId){
		var request = gapi.client.drive.children.list({
	      'folderId' : folderId,
	      'fields' : 'items,kind,nextLink,nextPageToken,selfLink'
	    });
		
		request.execute(function(response) {
			gdrive.updateList(response,'file',true, null);
		});
	},

	getItem: function(item, callback){
		var request = gapi.client.drive.files.get({
	      'fileId' : item.id
	    });
		
		request.execute(function(response) {
			callback(response);
		});
	},

	applyFilters: function(data,conditions,callback){
		var 	items = data.items
			,	count = 1
			,	aResult = []
			,	result = {
					'etag':'customFiltered',
					'filter':conditions,
					'items':null
				};

		for (var i = 0; i < items.length; i++) {
		    for (var condition in conditions) {
		    	if( items[i].hasOwnProperty(condition) ){
			    	for (var subCondition in conditions[condition]) {
			    		if (items[i][condition][subCondition] == conditions[condition][subCondition]) { aResult.push(items[i]); };
			    	};
			    };
		    };
		};
		result.items = aResult;
		return result;
	},

	bindShareFiles: function(){
		$('.sendFile').draggable({ 
			revert: true,
			stop: function() {
				app.showMessageStatus($(this).text()+' was moved to the teacher X folder');
			},
			cursor: "move",
			cursorAt: { top: -1, left: -2 },
			helper: function( event ) {
				return $( "<div class='air-file'>File: "+$(this).text()+"</div>" );
			}
		});

		$( "#teacherFolder .folder" ).droppable({
			//accept: ".folder",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				console.log($(this));
				$( this )
					.addClass( "ui-state-highlight" )
					.find( "p" )
						.html( "Dropped!" );
			}
		});
	},

	_initLoadShareOptions: function(){
		//load File Sharing Options DialogBox - **need app already installed on the account
		//gapi.load('drive-share', gdrive.bindShareFiles);
		//s = new gapi.drive.share.ShareClient('');
		//s.setItemIds('1YDfCEsf-h_obCHGcutl10Qm0l7lFthlxuacVJRgJHUxIF-O6w-TUFGN3');
		
		//update Teachers Folders, for the code simply is all Folders that people shared to the user.
		gdrive.makeRequest(
				{'userPermission':
					{'role' : 'writer'}
				},
				'folder',
				'teacherFolder'
			);
		
		
	}
	
}
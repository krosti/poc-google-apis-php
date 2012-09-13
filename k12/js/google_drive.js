gdrive = {

	_init: function(){
		gdrive.makeRequest(null);
		gdrive.loadActions();
		gdrive._initLoadShareOptions();
	},

	loadActions: function(){
		gdrive.BTNviewOptionsFilters();
		gdrive.filePicker();
		gdrive.addNewTeacherFolder();
	},

	makeRequest: function(conditions, type, customFolder, customQuery) {
		var request = (!customQuery)
			? gapi.client.drive.files.list({'maxResults':8}) //normal call
			: gapi.client.drive.files.list({                 //with custom query search
				'maxResults':8,
				'q':customQuery
			});

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
					,	fileIcons = document.createElement('div')
					,	modifiedDate = (!child && new Date(item.modifiedDate));
					
					if(fileType == type){
						fileIcons.className += ' '+items[i].userPermission.role;
						fileIcons.setAttribute('title',items[i].userPermission.role);

						modifiedDate = 
							modifiedDate.getMonth()+1 + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();

						divElement.setAttribute('class',fileType);
						
						var optional = (fileType == 'file') 
								? 	'<a class="sendFile '+fileTypeView+' '+''+' " href="'+item.alternateLink+'" id="'+items[i].id+'" target="_BLANK">'+ 
											item.title + ' (' + modifiedDate + ')' +
									'</a>'
								: 	item.title + ' (' + modifiedDate + ')' + 
									'<a id="'+item.id+'" class="sendFile '+fileTypeView+' updateFolderView " href="'+'#'+'">'+' '+'</a>';

						divElement.innerHTML = optional;
						divElement.appendChild(fileIcons);

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
			//var divElement = document.createElement('span');
			//divElement.innerHTML = 'Google Drive API '+data.message;
			//results.appendChild(divElement);
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
				//app.showMessageStatus($(this).text()+' was moved to the teacher X folder');
			},
			cursor: "move",
			cursorAt: { top: -1, left: -2 },
			helper: function( event ) {
				return $( "<div class='air-file'>File: "+$(this).text()+"</div>" );
			}
		});

		$( "#teachersClouds img" ).droppable({
			//accept: ".folder",
			activeClass: "ui-state-hover",
			hoverClass: "ui-state-active",
			drop: function( event, ui ) {
				$(this)
					.addClass("ui-state-highlight")
					.delay(1000)
					.removeClass("ui-state-highlight");
				
				gdrive.insertFileIntoFolder( $(this).attr('id') , ui.draggable.context.id );
			}
		});
	},

	shareDialog: function(){
		console.log('Init Share Dialog:');
		s = new gapi.drive.share.ShareClient('839403186376');
		s.setItemIds('1YDfCEsf-h_obCHGcutl10Qm0l7lFthlxuacVJRgJHUxIF-O6w-TUFGN3');
	},

	_initLoadShareOptions: function(){
		//load File Sharing Options DialogBox - **need app already installed on the account
		//gapi.load('drive-share', gdrive.bindShareFiles);
		//s = new gapi.drive.share.ShareClient('');
		//s.setItemIds('1YDfCEsf-h_obCHGcutl10Qm0l7lFthlxuacVJRgJHUxIF-O6w-TUFGN3');
		
		//update Teachers Folders, for the code simply is all Folders that people shared to the user.
		/*gdrive.makeRequest(
			{'userPermission':
				{'role' : ['writer','owner']}
			},												//deprecated because now we have CLOUDS
			'folder',
			'teacherFolder',
			""
		);*/
	},

	filePicker: function(d){
		var userInfo = {};
		app.validate(function(d){
			userInfo = d;
		});
		// Use the Google Loader script to load the google.picker script.
	    $('#shareGooglePicker').on('click', function(){
	    	gdrive.createPicker(userInfo);
	    });
	},
    
    // Create and render a Picker object for searching images.
    createPicker: function(userInfo) {
      	var view = new google.picker.View(google.picker.ViewId.FOLDERS);
      	view.setMimeTypes("image/png,image/jpeg,image/jpg");    
      	picker = new google.picker.PickerBuilder()
          //.enableFeature(google.picker.Feature.NAV_HIDDEN)
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .enableFeature(google.picker.Feature.SIMPLE_UPLOAD_ENABLED)
          .setAppId('839403186376')
          .setAuthUser(userInfo.email) //Optional: The user ID or email from the UserInfo API.
          .addView(view)
          .addView(new google.picker.DocsUploadView())
          .setCallback(gdrive.pickerCallback)
          .build();
        picker.setVisible(true);
    },

    // A simple callback implementation.
    pickerCallback: function(data) {
      var url = 'nothing';
      if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        url = doc[google.picker.Document.NAME];
        app.showMessageStatus('You picked: ' + url);
        
        gdrive.uploadFile(doc);
      }
      //var message = 'You picked: ' + url;
      //document.getElementById('googlePicker').innerHTML = message;
	},


	/**
	* Start the file upload.
	*
	* @param {Object} evt Arguments from the file selector.
	*/
    uploadFile: function(file) {
        //gapi.client.load('drive', 'v2', function() {
          //var file = evt.target.files[0];
          gdrive.insertFile(file);
        //});
    },

	/**
	* Insert new file.
	*
	* @param {File} fileData File object to read data from.
	* @param {Function} callback Function to call when the request is complete.
	*/
    insertFile: function (fileData, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
          var contentType = fileData.type || 'application/octet-stream';
          var metadata = {
            'title': fileData.name,
            'mimeType': contentType
          };

          var base64Data = btoa(reader.result);
          var multipartRequestBody =
              delimiter +
              'Content-Type: application/json\r\n\r\n' +
              JSON.stringify(metadata) +
              delimiter +
              'Content-Type: ' + contentType + '\r\n' +
              'Content-Transfer-Encoding: base64\r\n' +
              '\r\n' +
              base64Data +
              close_delim;

          var request = gapi.client.request({
              'path': '/upload/drive/v2/files',
              'method': 'POST',
              'params': {'uploadType': 'multipart'},
              'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
              },
              'body': multipartRequestBody});
          if (!callback) {
            callback = function(file) {
              console.log(file)
            };
          }
          request.execute(callback);
        }
    },

    addNewTeacherFolder: function(){
    	$('#newFolderDialog a').on('click',function(){
    		$.ajax({
    			dataType: "json",
    			crossDomain: true,
    			data: 'access_token='+gapi.auth.getToken().access_token,
    			url:$('#newFolderDialog input').val(),
    			success: function(d){
    				console.log(d);
    			}
    		});
    	});
    	$('#newTeacherBox').on('click',function(){
    		$( "#newFolderDialog" ).dialog({
    			title: 'Add New Teacher Cloud',
				height: 140,
				modal: true
			});
    	});

    },

    /**
	 * Insert a file into a folder.
	 *
	 * @param {String} folderId ID of the folder to insert the file into.
	 * @param {String} fileId ID of the file to insert.
	 */
	insertFileIntoFolder: function(folderId, fileId) {
	  var body = {'id': fileId};
	  var request = gapi.client.drive.children.insert({
	    'folderId': folderId,
	    'resource': body
	  });
	  request.execute(function(resp) {
	  	app.showMessageStatus('<span style="color:green;">File has been moved.</span>');
	  });
	}
	
}
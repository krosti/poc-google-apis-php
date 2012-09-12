guser = {
	
	_init:function(userInfo){
		guser.updateBox(userInfo);
	},

	updateBox:function(userInfo){
		$('#userName').append(userInfo.email);
	}
}
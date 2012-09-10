gtalk = {
	
	_init: function(){
		
	},

	test2: function(){

	},

	test: function(urls,user_name,pass,oauth_token){

		var	oau = Base64.encode("\0" + user_name + "\0" + pass + "\0" + oauth_token);
		var msgA = '<auth xmlns="urn:ietf:params:xml:ns:xmpp-sasl"  mechanism="X-OAUTH2" auth:service="oauth2" xmlns:auth="http://www.google.com/talk/protocol/auth">'+oau+'</auth>';
		//mg = "<iq type='get' to='gmail.com'><query xmlns='http://jabber.org/protocol/disco#info'/></iq>";
		//var fake_url = 'https://talk.google.com:5222';


		var msg = "<body xmlns='http://jabber.org/protocol/httpbind' to='globant.com' xml:lang='en' wait='3600' inactivity='60' hold='1' content='text/xml; charset=utf-8' ver='1.6' xmpp:version='1.0' xmlns:xmpp='urn:xmpp:xbosh'>"+msgA+"</body>";
		//console.log(Base64.encode("\0" + user_name + "\0" + oauth_token));

		$.post(urls, msgA,{
			//type: 'POST',
			contentType: 'text/xml',
            processData: false,
			//data:msg,
			//url: urls,
			success:function(data){
				console.log(data);
			},
			dataType: 'xml'
		});
	},

	xmppConnection: function(){
		$("#loginBTN").on('click',function(){
			var server_name = "@localhost";
			var jid = 'fernando.cea@labsatk12.com' + server_name;
			var password = 'Cuadrilatero2';
			var logContainer = $("#log");
			var contactList = $("#contacts");
		
			//An example of bosh server. This site is working but it can change or go down.
			//If you are going to have a production site, you must install your own BOSH server
			//var url ="http://bosh.metajack.im:5280/xmpp-httpbind";
			//var url ="http://jabber.hot-chilli.net/";
			var url ="https://talk.google.com:5222/";
			$.xmpp.connect({url:url, jid: jid, password: password,
				onConnect: function(){
					logContainer.html("Connected");
					$.xmpp.setPresence(null);
				},
				onPresence: function(presence){
					var curId = presence.from.split('@')[0];

					$("#contacts li").each(function() {
						if ($(this).data('username') == curId) {
							$(this).remove()
							return false;
						}
					
					});

					var status_icon = "available_icon";
					switch (presence.show) {
						case "dnd": status_icon = "busy_icon";
												break;

						case "away": status_icon = "away_icon";
												break;

						default: status_icon = "available_icon";
					}
				
					var contact = $("<li data-username='" + curId + "'><div class='" + status_icon + " status_icon'>&nbsp;</div>");
					contact.append("<a href='javascript:void(0)'>"+ curId +"</a>");
					contact.find("a").click(function(){
							var id = MD5.hexdigest(presence.from);
							var conversation = $("#"+id);
							if(conversation.length == 0)
								openChat({to:presence.from});
					});
					contactList.append(contact);
				},
				onDisconnect: function(){
					logContainer.html("Disconnected");
				},
				onMessage: function(message){
				
					var jid = message.from.split("/");
					var id = MD5.hexdigest(message.from);
					var conversation = $("#"+id);
					if(conversation.length == 0){
						openChat({to:message.from});
					}
					conversation = $("#"+id);
					//conversation.find(".conversation").append("<div>"+ jid[0] +": "+ message.body +"</div>");

					if (message.body == null) {
						return;
					}

					var current_message = "<div class = 'msgBlock'><span class = 'chatter_name'>"+ jid[0].split('@')[0] +": </span><br>"  + message.body +"</div>"

					conversation.find(".conversation").append(current_message);
					conversation.find(".conversation").prop('scrollTop', conversation.find('.conversation').prop("scrollHeight"));
				
				},onError:function(error){
					$('#loadingChat').slideToggle();
					logContainer.append(error.error);
				}
			});		
		});		
	},

	openChat: function(options){
		var id = MD5.hexdigest(options.to);

		// Chat box
		var chat_window = "<div id='" + id + "' class = 'chatBox'>";

		// Chat box header
		chat_window += "<div class='chatBox_header_wrapper'><div class='chatBox_header'> <div class='available_icon status_icon'>&nbsp;</div>" + options.to.split('@')[0] +" </div>";

		// chat box toolbaropenChat
		chat_window += "<div class='chatBox_toolbar'> <strong><span class='chatBox_minimise'><a href='#'>_</a></span> <span class='chatBox_close'><a href='#'>&times;</a></span></strong></div></div>";

		// Chat box actual conversation
		chat_window += "<div class='chatBox_body'><div class='conversation'></div>"

		// Chat box message box
		chat_window += "<div class='chatBox_curmsg'><input type='text' class='myCurMsg' /><button class='btn_sendMsg'>Send</button></div>";
		chat_window += "</div></div>";

		var chat = $(chat_window);
		var input = chat.find("input");
		var sendBut = chat.find("button.btn_sendMsg");
		var conversation = chat.find(".conversation");
		sendBut.click(function(){
			$.xmpp.sendMessage({to:options.to, body: input.val()});
			//conversation.append("<div>"+ $.xmpp.jid +": "+ input.val() +"</div>");

			var current_message = "<div class = 'msgBlock'><span class = 'chatter_name'>"+ $.xmpp.jid.split('@')[0] +": </span><br>"  + input.val() +"</div>"

			conversation.append(current_message);
			conversation.prop('scrollTop', conversation.prop("scrollHeight"));
			input.val("");
		});

		if ($('#chatBox_group').length == 0) {
			var chatBox_group = "<div style='height: 250px;' id='chatBox_group'></div>"
			$(chatBox_group).css('position', 'absolute');
			$(chatBox_group).css('z-index', 1000);
			$(chatBox_group).css('top', $(window).height() - 222);

			$("body").append(chatBox_group);
		}

		//$(chat).css('position', 'absolute');
		//$(chat).css('z-index', 1000);
		//$(chat).css('top', $(window).height() - 220);
		$(chat).css('float', 'right');
		$(chat).css('margin-right', '10px');

		$("#chatBox_group").append(chat);
		$(chat).show();
	}
}
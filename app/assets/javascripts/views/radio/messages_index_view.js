SV.Views.MessagesIndex = Backbone.View.extend({
	events: {
		"keypress input": "enterPressed"
	},
	
	initialize: function() {
		this.connectToChatChannel();
		this.bindToChatEvent();
	},
	
	render: function() {
		var renderedContent = JST["messages/index"]({
			messages: this.collection
		});
		this.$el.html(renderedContent);
		
		return this;
	},
	
	connectToChatChannel: function() {
		var channelID = Base64.encode(this.collection.channelName).slice(0, 6);
		this.chatChannel = SV.pusher.subscribe('private-chat-'+ channelID);
	},
	
	bindToChatEvent: function() {
		var that = this;
		this.chatChannel.bind('client-chat', function(messageData) {
		 	that.writeChat(messageData);
		});
	},
	
	writeChat: function(messageData) {
		if (this.$("#chat").children().length > 7) {
			this.$("#chat").children().last().remove();
		}
		var sender = messageData.senderEmail ? messageData.senderEmail : "anonymous";
		this.$("#chat").prepend("<li><strong>"+ sender +"</strong> "
									+ messageData.body +"</li>");
	},
	
	sendChat: function(messageBody) {
		var senderEmail = SV.Store.currentUser ? SV.Store.currentUser.get("email") : null;
		var messageData = { body: messageBody,
				senderEmail: senderEmail };
		var triggered = this.chatChannel.trigger('client-chat', messageData),
				that = this;
		
		setTimeout(function() {
			if (triggered) {
				that.writeChat(messageData);
				that.$("#new-message").val("");
			}
		}, 300);
	},
	
	enterPressed: function(event) {
		if (event.keyCode == 13) {
			this.sendChat($(event.target).val());
		}
	}
});
SV.Views.MessagesIndex = Backbone.View.extend({
	events: {
		"keypress input": "enterPressed"
	},
	
	initialize: function() {		
		var renderCallback = this.render.bind(this);
		this.listenTo(this.collection, 'add', renderCallback);
		this.listenTo(this.collection, 'change', renderCallback);
		this.listenTo(this.collection, 'remove', renderCallback);
	},
	
	render: function() {
		this.connectToChatChannel();
		
		var renderedContent = JST["messages/index"]({
			messages: this.collection
		});
		this.$el.html(renderedContent);
		
		return this;
	},
	
	connectToChatChannel: function() {
		// console.log(this.collection.channelName)
		var channel = SV.pusher.subscribe(this.collection.channelName);
		channel.bind('chatted', function(data) {
		  alert('An event was triggered with message: ' + data.message);
		});
	},
	
	enterPressed: function(event) {
		if (event.keyCode == 13) {
			this.collection.create({ 
				body: $(event.target).val(),
				sender_id: null,
				channel: this.channelName
			});
		}
	}
});
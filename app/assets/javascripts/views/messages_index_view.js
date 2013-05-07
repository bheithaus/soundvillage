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
		var renderedContent = JST["messages/index"]({
			messages: this.collection
		});
		this.$el.html(renderedContent);
		
		return this;
	},
	
	enterPressed: function(event) {
		if (event.keyCode == 13) {
			this.collection.create({ 
				body: $(event.target).val() 
			});
		}
	}
});
SV.Views.RadioTags = Backbone.View.extend({
	initialize: function() {
		var renderCallback = this.render.bind(this);
		
		this.listenTo(this.collection, 'add', renderCallback);
		this.listenTo(this.collection, 'reset', renderCallback);
	},
	
	render: function() {
		var renderedContent = JST["radio/tags"]({
			tags: this.collection
		});
		this.$el.html(renderedContent);
		
		return this;
	}
});
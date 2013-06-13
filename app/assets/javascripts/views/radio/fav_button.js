SV.Views.FavButton = Backbone.View.extend({
	initialize: function() {
		var renderCallback = this.render.bind(this);
		
		this.listenTo(Backbone, 'session', renderCallback);
	},
	
	render: function() {
		var renderedContent = JST["radio/fav_button"]();
		this.$el.html(renderedContent);
		
		return this;
	}
});
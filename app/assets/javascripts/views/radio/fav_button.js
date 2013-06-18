SV.Views.FavButton = Backbone.View.extend({
	initialize: function() {
		var renderCallback = this.render.bind(this);
		
		this.listenTo(Backbone, 'session', renderCallback);
	},
	
	render: function() {
		var disabled = SV.router.currentStation.isLoaded ? "" : "disabled",
		renderedContent = JST["radio/fav_button"]({
			disabled: disabled
		});
		this.$el.html(renderedContent);
		
		return this;
	}
});
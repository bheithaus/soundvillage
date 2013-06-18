SV.Views.FavButton = Backbone.View.extend({
	initialize: function() {
		var renderCallback = this.render.bind(this);
		
		this.listenTo(Backbone, 'session', renderCallback);
	},
	
	render: function() {
		console.log("rendering");
		console.log(SV.router.currentStation.isLoaded);
		
		var renderedContent = JST["radio/fav_button"]({
			disabled: SV.router.currentStation.isLoaded ? "" : "disabled"
		});
		this.$el.html(renderedContent);
		
		return this;
	}
});
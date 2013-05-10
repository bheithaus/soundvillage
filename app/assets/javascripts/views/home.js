SV.Views.Home = Backbone.View.extend({	
	render: function() {
		var renderedContent = JST["home"]();
		this.$el.html(renderedContent);
		
		return this;
	}
});
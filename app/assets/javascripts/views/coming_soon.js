SV.Views.ComingSoon = Backbone.View.extend({	
	render: function() {
		var renderedContent = JST["coming_soon"]();
		this.$el.html(renderedContent);
		
		return this;
	}
});
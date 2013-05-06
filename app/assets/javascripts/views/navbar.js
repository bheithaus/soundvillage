SV.Views.Navbar = Backbone.View.extend({
	
	render: function() {
		var renderedContent = JST["nav/navbar"]();
		this.$el.html(renderedContent);
		
		return this;
	}
	
});
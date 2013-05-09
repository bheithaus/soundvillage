SV.Views.RadioIndex = Backbone.View.extend({	
	events: {
		"click a"    : "selectStation"
	},
	
	render: function() {
		var renderedContent = JST["radio/index"]({
			stations: this.collection
		});
		this.$el.html(renderedContent);
		
		return this;
	}
});
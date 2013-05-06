SV.Views.RadioTags = Backbone.View.extend({
	
	render: function() {
		var renderedContent = JST["radio/tags"]({
			
		});
		this.$el.html(renderedContent);
		
		return this;
	}
});
// 
// <% tags.each(function (tag) { %>
// 	<li><%= tag.escape("name") %></li>
// <% }); %>
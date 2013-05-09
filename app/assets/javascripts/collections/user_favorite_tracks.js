SV.Collections.UserFavoriteTracks = Backbone.Collection.extend({
	initialize: function(model, options) {
		this.user = options.user;
	},
	
	url: function() {
		return "/users/" + this.user.id + "/favorite_tracks";
	},
	
	model: SV.Models.Track
});
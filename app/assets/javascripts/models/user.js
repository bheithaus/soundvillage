SV.Models.User = Backbone.RelationalModel.extend({
	urlRoot: function() {
		return "/users";
	},
	
	relations: [{
		type: Backbone.HasMany,
		key: "favorite_tracks",
		keyDestination: "favorite_tracks_attributes",
		relatedModel: "SV.Models.Track",
		collectionType: "SV.Collections.UserFavoriteTracks",
		collectionOptions: function(user) {
			return { user: user };
		},
		reverseRelation: {
			includeInJSON: "id"
		}
	}],
	
	toJSON: function() {
		var attrs = _.clone(this.attributes);
		attrs["favorite_tracks_attributes"] = attrs["favorite_tracks"];
		delete attrs["favorite_tracks"];
		delete attrs["created_at"];
		delete attrs["updated_at"];
		delete attrs["id"];
		
		return { user: attrs };
	}
});
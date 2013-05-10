SV.Views.FavoritesIndex = Backbone.View.extend({
	initialize: function() {
		this.renderCallback = this.render.bind(this);
	},
	
	events: {
		"click a#new-station" : "createStation",
		"click a#unfavorite" : "unFavoriteTrack"
	},
	
	createStation: function(event) {
		var fromTrackID = parseInt($(event.target).parent().data("id"));
		var fromTrack = SV.Store.currentUser
							.get("favorite_tracks")
							.findWhere({ id: fromTrackID });
							
		var newStation = new SV.Models.RadioStation({
							name: "station from track " + fromTrack.get("title") });
		
		console.log(fromTrack.get("url"));
		var newStationTags;	
		SC.get(fromTrack.get("url"), function(track) {
			newStationTags = track.tag_list.split(" ");
			newStationTags = _(newStationTags).filter(function(tag) {
				return tag.length < 10;
			});
			newStationTags = _(newStationTags).map(function(tag) {
				return { name: tag.replace('"','') };
			});
			
			console.log(newStationTags);
			
			newStation.get("tags").add(newStationTags);
			console.log(newStation.get("tags"))
			newStation.save({}, {
				success: function(savedStationData) {
					SV.Store.radioStations.add(savedStationData);
					Backbone.history.navigate("radio/" + savedStationData.id,
												{ trigger: true });
				}
			});
		});

		console.log($(event.target).parent().data("id"));
	},
	
	unFavoriteTrack: function(event) {
		if (this._isFavoriting) {return;}
		this._isFavoriting = true;
		var fromTrackID = parseInt($(event.target).parent().data("id"));
		var favorited = SV.Store
						.currentUser.get("favorite_tracks")
						.findWhere({ id: fromTrackID });
		var that = this;

		SV.Store.currentUser.get("favorite_tracks").remove(favorited);
		
		SV.Store.currentUser.save({}, {
			url: '/users',
			success: function(model, resp, options) {
				console.log(resp)
				SV.Store.currentUser.get("favorite_tracks").reset(resp);
				that.renderCallback();
			}
		});
		
		this._isFavoriting = false;
	},
	
	render: function() {
		var renderedContent = JST["favorites/index"]({
			favorite_tracks: this.collection
		});
		
		this.$el.html(renderedContent);
		
		return this;
	}
});
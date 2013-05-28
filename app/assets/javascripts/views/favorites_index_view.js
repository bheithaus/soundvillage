SV.Views.FavoritesIndex = Backbone.View.extend({
	initialize: function() {
		this.renderCallback = this.render.bind(this);
	},
	
	events: {
		"click a#new-station" : "createStation",
		"click a#unfavorite" : "confirmUnfavorite",
		"click a.signin" : "signin",
		"click a.signup" : "signup"
	},
	
	signin: function() {
		SV.router.hideModal();
		SV.navbarView.signInModal();
	},
	
	signup: function() {
		SV.router.hideModal();
		SV.navbarView.signUpModal();
	},
	
	createStation: function(event) {
		var	newStationTags,
		    fromTrackID = parseInt($(event.target).parent().data("id")),
		      fromTrack = SV.Store.currentUser
								.get("favorite_tracks")
								.findWhere({ id: fromTrackID }),	
		     newStation = new SV.Models.RadioStation({
								name: fromTrack.get("title"),
							});
							
		SC.get(fromTrack.get("url"), function(track) {
			//on response from SoundCloud
			newStationTags = track.tag_list.split(" ");
			newStationTags = _(newStationTags).filter(function(tag) {
				return tag.length < 10;
			});
			newStationTags = _(newStationTags).map(function(tag) {
				return { name: tag.replace('"','') };
			});
						
			newStation.get("tags").add(newStationTags);
			newStation.save({
				image_url: track.artwork_url
			}, {
				success: function(savedStationData) {
					SV.Store.radioStations.add(savedStationData);
					Backbone.history.navigate("station/" + savedStationData.id,
												{ trigger: true });
				}
			});
		});
	},
	
	confirmUnfavorite: function(event) {
		if (confirm("are you sure?")) {
			this.unFavoriteTrack(event);
		}
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
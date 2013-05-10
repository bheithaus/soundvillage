SV.Views.FavoritesIndex = Backbone.View.extend({
	events: {
		"click a#new-station" : "createStation"
	},
	
	createStation: function(event) {
			// console.log("this is happening")
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
		
		

		// 	
		// var tag = this.$("#station-tag").val();
		// if (tag) {
		// 	this.addTag(tag);
		// }
		// 	
		// var that = this;	
		// this.model.save({}, {
		// 	success: function(savedStationData) {
		// 		SV.Store.radioStations.add(savedStationData);
		// 		$("#new-station-modal").modal('hide');
		// 		Backbone.history.navigate("radio/" + savedStationData.id,
		// 									{ trigger: true });
		// 	}
		// });
		// },
		
		
		
		console.log($(event.target).parent().data("id"));
	},
	
	render: function() {
		var renderedContent = JST["favorites/index"]({
			favorite_tracks: this.collection
		});
		
		this.$el.html(renderedContent);
		
		return this;
	}
});
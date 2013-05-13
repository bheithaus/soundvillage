SV.Models.RadioStation = Backbone.RelationalModel.extend({
	initialize: function() {
		var that = this;
		
		that.genres = that.get("genre") ? that.get("genre") : "";
		// console.log("genre");
// 		console.log(that.get("genre"))
// 		console.log(that.genres);
		that.firstQuery = true;
		//do i have tags?
		//set upcoming tracks if possible
		that.tags = {};
		
		that.get("tags").each(function(tag) {
			that.tags[tag.get("name")] = that.tags[tag.get("name")] ? that.tags[tag.get("name")] + 1 : 1;
		});
	},
	
	urlRoot: "/radio_stations",
	
	relations: [{
		type: Backbone.HasMany,
		key: "tags",
		relatedModel: "SV.Models.Tag",
		collectionType: "SV.Collections.RadioStationTags",
		collectionOptions: function(station) {
			return {radio_station: station};
		},
		reverseRelation: {
			key: "radio_station",
			keySource: "radio_station_id",
			includeInJSON: false
		},
	}],
	
	getUpcomingTracks: function(callback) {
		// console.log(this.get("tags").length);
		if (this.get("tags").length) {
			var client_id = '1853d978ae73aae455ce18bf7c92f5dc'
			var tagString = this.tagString();
			var url = 'https://api.soundcloud.com/tracks.json?client_id=' 
						+ client_id + '&genres=' + this.genres + '&tags='+ tagString +'&order_by=hotness';
			var that = this;
			// console.log(url);
			$.getJSON(
			  url,
			  function (data) {
				  that.isLoaded = true;
				  that.upcomingTracks = helpers.shuffle(data);
				  console.log("upcoming tracks");
				  that.printUpcoming();
				  if (callback) {
					  callback();
				  }
			  }
			);
		}
	},
	
	printUpcoming: function() {
		_(this.upcomingTracks).each(function(track, i) {
			console.log("Track #" + i + ": " + track.title);
		});
	},
	
	nextTrack: function() {
		if (!this.upcomingTracks) {
			this.getUpcomingTracks();
			return;
		} else if (this.upcomingTracks.length == 1) {
			this.getUpcomingTracks();
		}
		// console.log(this.upcomingTracks);
	// 	console.log("next track");
	// 	console.log(this.upcomingTracks[0]);
		this.addTags(this.upcomingTracks[0].tag_list);
		return this.upcomingTracks.shift();
	},
	
	addTags: function(tags) {
		var that = this;
		_(tags.split(" ")).each(function(tag) {
			that.tags[tag] = that.tags[tag] ? that.tags[tag] + 1 : 1;
		});
	},
	
	tagString: function() {
		if (this.firstQuery) {
			this.firstQuery = false;
			return this.get("tags").pluck("name").join();
		} else {
			return this.topTags().join();
		}
	},
	
	topTags: function() {
		var sorted_tags = [];
		
		for (var tag in this.tags) {
			sorted_tags.push([tag, this.tags[tag]]);
		}
		sorted_tags.sort(function(a, b) {
			return b[1] - a[1];
		});
		
		return [sorted_tags[0][0], sorted_tags[1][0], sorted_tags[2][0]];
	},
	
	toJSON: function () {
		var attrs = _.clone(this.attributes);
		attrs["tags_attributes"] = attrs["tags"];
		delete attrs["tags"];
		
		return { radio_station: attrs };
	}
});

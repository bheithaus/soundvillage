SV.Models.RadioStation = Backbone.RelationalModel.extend({
	initialize: function(options) {
		var that = this;
		
		//get rid of genres?
		that.genres = that.get("genre") ? that.get("genre") : "";

		that.firstQuery = true;
		that.attempts = 0;
		
		that.tags = {};
		
		that.addStoredTagsToTagCounts();
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
	
	addStoredTagsToTagCounts: function() {
		var that = this;
		
		that.get("tags").each(function(tag) {
			that.tags[tag.get("name")] = tag.get("weight");
		});
	},
	
	getUpcomingTracks: function(callback) {
		console.log(this.get("tags"));
		if (this.get("tags").length) {
			var client_id = '1853d978ae73aae455ce18bf7c92f5dc'
			var tagString = this.tagString();
			var url = 'https://api.soundcloud.com/tracks.json?client_id=' 
						+ client_id + '&genres=' + this.genres + '&tags='+ tagString +'&order_by=hotness';
			var that = this;			
			
		  	console.log(url);
			
			$.getJSON(
			  url,
			  function (data) {
				  that.isLoaded = true;
	  			  that.firstQuery = false;
				  that.attempts = 0;
				  
				  that.upcomingTracks = helpers.shuffle(data).slice(0, 5);
				  console.log("upcoming tracks");
				  that.printUpcoming();
				  if (callback) {
					  callback();
				  }
			  }
			).fail(function() { 
				that.attempts++;
				if( that.attempts > 7) {
					that.SCAPIRequestErrorCallback();
				} else {
			        console.log(that.attempts + " tries querying Soundcloud, retrying");
					that.getUpcomingTracks(callback);
				}
			});
		}
	},
	
	updateTags: function() {
		var tags = this.topTags();
		this.get("tags").update(tags);
		this.save();
	},
	
	// savableTags: function() {
	// 	var tags = this.topTags();
	// 	
	// 	console.log("top tags");
	// 	console.log(tags);
	// 	return _(tags).map(function(tag) {
	// 		return { name: tag }
	// 	});
	// },
	
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

		this.currentTracksTags = this.upcomingTracks[0].tag_list;
		return this.upcomingTracks.shift();
	},
	
	addTag: function(tag, weight) {
		this.get("tags").add({ name: tag , weight: weight });
	},
	
	addToWorkingTags: function() {
		var that = this,
			tags = this.currentTracksTags;
		_(tags.split(" ")).each(function(tag) {
			tag.replace(/\"/g, "");
			tag.replace(/\'/g, "");
			if (tag.length) {
				that.tags[tag] = that.tags[tag] ? that.tags[tag] + 1 : 1;
			}
		});
	},
	
	tagString: function() {
		if (!this.get("editable")) {
			return this.get("tags").pluck("name").join();
		} else {
			return _(this.topTags()).map(function(tag) {
				return tag.name;
			}).join();
		}
	},
	
	topTags: function() {
		var sorted_tags = []
			topTags = [];
	
		for (var tag in this.tags) {
			sorted_tags.push([tag, this.tags[tag]]);
		}
		sorted_tags.sort(function(a, b) {
			return b[1] - a[1];
		});
		
		var numberOfTags = sorted_tags.length < 4 ? sorted_tags.length : 4;
		
		_(numberOfTags).times(function(i) {
			topTags.push({ name: sorted_tags[i][0], weight: sorted_tags[i][1] });
		});
		
		return topTags;
	},
	
	toJSON: function () {
		var attrs = _.clone(this.attributes);
		attrs["tags_attributes"] = attrs["tags"];
		delete attrs["tags"];
		
		return { radio_station: attrs };
	}
});

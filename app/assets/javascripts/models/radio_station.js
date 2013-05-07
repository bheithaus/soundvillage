SV.Models.RadioStation = Backbone.RelationalModel.extend({
	initialize: function() {
		
		//do i have tags?
		//set upcoming tracks if possible
		
		this.getUpcomingTracks(); 
		
	},
	
	urlRoot: "/radio_stations",
	
	relations: [{
		type: Backbone.HasMany,
		key: "tags",
		relatedModel: "SV.Models.Tag",
		collectionType: "SV.Collections.RadioStationTags",
		collectionOptions: function(station) {
			return {radio_station: station}
		},
		reverseRelation: {
			key: "radio_station",
			keySource: "radio_station_id",
			includeInJSON: false
		}
	}],
	
	getUpcomingTracks: function() {
		console.log(this.get("tags").length);
		if (this.get("tags").length) {
			var client_id = '1853d978ae73aae455ce18bf7c92f5dc'
			var url = 'https://api.soundcloud.com/tracks.json?client_id=' 
						+ client_id + '&tags='+ this.tagString() +'&order_by=hotness';
			var that = this;
			$.getJSON(
			  url,
			  function (data) {
				  that.upcomingTracks = data;
			  }
			);
		}
	},
	
	nextTrack: function() {
		if (this.upcomingTracks.length == 1) {
			this.getUpcomingTracks();
		}
		return this.upcomingTracks.shift();
	},
	
	tagString: function() {
		var str;
		_(this.tags).each(function(tag){
			str += tag.escape("name");
		});
	},
	
	toJSON: function () {
		var attrs = _.clone(this.attributes);
		attrs["tags_attributes"] = attrs["tags"];
		delete attrs["tags"];
		
		return { radio_station: attrs };
	}
});

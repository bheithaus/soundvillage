SV.Models.RadioStation = Backbone.RelationalModel.extend({
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
	
	toJSON: function () {
		var attrs = _.clone(this.attributes);
		attrs["tags_attributes"] = attrs["tags"];
		delete attrs["tags"];
		
		return { radio_station: attrs };
	}
});
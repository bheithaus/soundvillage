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
			includeInJSON: 'id'
		}
	}]
});
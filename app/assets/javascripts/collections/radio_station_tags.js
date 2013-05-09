SV.Collections.RadioStationTags = Backbone.Collection.extend({
	initialize: function(data, options) {
		// console.log(data);
// 		console.log(options);
		this.radio_station = options.radio_station;
	},
	
	model: SV.Models.Tag,

	url: function() {
		return "/tags/" + this.radio_station.id + "/tags";
	}
});
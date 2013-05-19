SV.Collections.RadioStationTags = Backbone.Collection.extend({
	initialize: function(data, options) {
		// console.log(data);
// 		console.log(options);
		this.radio_station = options.radio_station;
	},
	
	model: SV.Models.Tag,

	url: function() {
		return "/tags/" + this.radio_station.id + "/tags";
	},
	
	update: function(tags) {
		var that = this,
			tag;
		_(tags).each(function(tagOBJ) {
			tag = tagOBJ.name.toLowerCase()
			model = that.findWhere({ name: tag });
			if (!model && tagOBJ.weight > 2) {
				that.add({
					name: tag,
				  weight: tagOBJ.weight });
			} else {
				model.set({ weight: tagOBJ.weight });
			}
		});
	}
});
SV.Collections.RadioStationTags = Backbone.Collection.extend({
	initialize: function(data, options) {
		this.radio_station = options.radio_station;
	},
	
	model: SV.Models.Tag,

	url: function() {
		return "/tags/" + this.radio_station.id + "/tags";
	},
	
	update: function(tags) {
		console.log(tags);
		
		var that = this,
			tag;
		_(tags).each(function(tagOBJ) {
			tag = tagOBJ.name.toLowerCase();
			model = that.findWhere({ name: tag });
			if (!model) {
				if (tagOBJ.weight > 2) {
					that.add({
						name: tag,
					  weight: tagOBJ.weight });
				}
			} else if( model.get("weight") != tagOBJ.weight ) {
				model.set({ weight: tagOBJ.weight });
			}
		});
	}
});
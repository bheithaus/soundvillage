SV.Models.Track = Backbone.RelationalModel.extend({
	toJSON: function() {
		var attrs = _.clone(this.attributes);
		delete attrs["created_at"];
		delete attrs["updated_at"];
		
		return attrs;
	}
});
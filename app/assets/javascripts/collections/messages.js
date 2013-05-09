SV.Collections.Messages = Backbone.Collection.extend({
	model: SV.Models.Message,
	
	url: "/messages",
	
	initialize: function(model, options) {
		
		this.channelName = options.channelName;
		// console.log(this.channelName)
// 		console.log(options);
	},
});
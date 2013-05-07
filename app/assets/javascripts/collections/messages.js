SV.Collections.Messages = Backbone.Collection.extend({
	model: SV.Models.Message,
	
	url: "/messages",
	
	initialize: function() {
	},
	
// 	handle_change: function(message) {
// 		var model;
// 		
// 		// switch(message.action) {
// // 			case 'create':
// // 				this.add(message.obj);
// // 				break;
// // 			case 'update':
// // 				model = this.get(message.id);
// // 				model.set(message.obj);
// // 				break;
// // 			case 'destroy':
// // 				this.remove(message.obj);
// // 		}
// 	}
});
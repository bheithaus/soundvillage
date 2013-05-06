SV.Routers.SoundVillageRouter = Backbone.Router.extend({
	initialize: function($content) {
		this.$content = $content;
	},
	
	before: function(route, params) {
		console.log("running before filter");
		// console.log(route);
// 		console.log(params);
// 		console.log(route.toString().split("/")[0]);
		
		// if (!params.length) {
		// 	this.selectNewTab(route);
		// } else {
		// 	this.selectNewTab(
		// 		route.toString().split("/")[0]
		// 	);
		// }
		
		if (this.currentView) {
			this.currentView.remove();
		}
		console.log(new Date().getTime());
	},
	
	after: function(route) {
		console.log("running after filter");
		console.log(new Date().getTime());
		this.$content.html(this.currentView.render().$el);
	},
	
	routes: {
		"welcome": "welcome",
		"home": "home",
		"radio": "radio",
		"games": "game",
		"games/:id": "game"
	},
	
	radio: function() {
		this.currentView = new SV.Views.Radio();
	}
	// selectNewTab: function(route) {
// 		console.log("#"+route);
// 		
// 		$("ul.nav").children().filter("li").removeClass("active");
// 		$("li#" + route).addClass("active");
// 	},
// 	
// 	game: function(id) {
// 		console.log(typeof(CH.Store.currentUser.get("games")));
// 		this.currentView = new CH.Views.Game({
// 			collection: CH.Store.currentUser.get("games"),
// 			gameID: parseInt(id)
// 		});
// 		
// 		this.$content.html(this.currentView.render().$el);
// 	},
// 	
// 	chat: function() {
// 		//stub
// 	},
// 	
// 	welcome: function(){		
// 		this.currentView = new CH.Views.Welcome();
// 		
// 		this.$content.html(this.currentView.render().$el);
// 	},
// 	
// 	usersIndex: function(){		
// 		this.currentView = new CH.Views.UsersIndex({
// 			collection: CH.Store.users
// 		});
// 		
// 		this.$content.html(this.currentView.render().$el);
// 	},
// 	
// 	home: function() {	
// 		this.currentView = new CH.Views.UserLanding({
// 			model: CH.Store.currentUser
// 		});
// 		
// 		this.$content.html(this.currentView.render().$el);
// 	}
});
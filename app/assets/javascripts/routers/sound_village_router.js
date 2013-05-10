SV.Routers.SoundVillageRouter = Backbone.Router.extend({
	initialize: function($content) {
		this.$content = $content;
	},
	
	before: function(route, params) {
		console.log("running before filter");
		console.log(route);
		
		if (!params.length) {
			this.selectNewTab(route);
		} else {
			this.selectNewTab(
				route.toString().split("/")[0]
			);
		}
		
		if (this.currentView) {
			this.currentView.remove();
		}
		// console.log(new Date().getTime());
	},
	
	after: function(route) {
		// console.log("running after filter");
// 		console.log(new Date().getTime());
		if (this.currentView) {
			this.$content.html(this.currentView.render().$el);	
		}
	},
	
	routes: {
		"welcome": "welcome",
		"home": "home",
		"radio/:id": "radioStation",
		"radio": "radio",
		"favorites" : "favorites",
		"friends": "friends",
		"games/:id": "game"
	},
	
	favorites: function() {
		this.currentView = new SV.Views.FavoritesIndex({
			collection: SV.Store.currentUser ? SV.Store.currentUser.get("favorite_tracks") : null
		});
	},
	
	radio: function() {
		this.currentView = new SV.Views.RadioIndex({
			collection: SV.Store.radioStations
		});
	},
	
	radioStation: function(id) {
		console.log(id);
		var tags = new SV.Collections.Tags();
		tags.fetch();
		var station = SV.Store.radioStations.findWhere({ id: parseInt(id) });
		console.log(station)
		this.currentView = new SV.Views.RadioStation({
			model: station
		});
	},
	
	selectNewTab: function(route) {
		// console.log("#"+route);
		$("ul.nav").children().filter("li").removeClass("active");
		$("li#" + route).addClass("active");
	}
});
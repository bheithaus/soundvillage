SV.Routers.SoundVillageRouter = Backbone.Router.extend({
	initialize: function($content) {
		this.$content = $content;
	},
	
	before: function(route, params) {
		if (!route) {
			route = 'home';
		}
		
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
	},
	
	after: function(route) {
		if (this.currentView) {
			this.$content.html(this.currentView.render().$el);	
		}
	},
	
	routes: {
		"": "home",
		"home": "home",
		"radio/:id": "radioStation",
		"radio": "radio",
		"favorites" : "favorites",
		"friends": "friends",
	},
	
	home: function() {
		this.currentView = new SV.Views.Home();
	},
	
	friends: function() {
		this.currentView = new SV.Views.ComingSoon();
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
		var station = SV.Store.radioStations.findWhere({ id: parseInt(id) });
		this.currentView = new SV.Views.RadioStation({
			model: station
		});
	},
	
	selectNewTab: function(route) {
		$("ul.nav").children().filter("li").removeClass("active");
		$("li#" + route).addClass("active");
	}
});
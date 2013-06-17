SV.Routers.SoundVillageRouter = Backbone.Router.extend({
	initialize: function($content, $modal) {
		this.$content = $content;
		this.$modal = $modal;
		this.stationHasChanged = false;
	},
	
	VALID_ROUTES: [
	"station/:id",
	""
	],
	
	before: function(route, params) {
		//console.log("route" + route);
		if (!route || this.VALID_ROUTES.indexOf(route) == -1) { // errant routes get directed to home
			//console.log(route);
			route = '';
		}
		
		if (params && !params.length) {
			this.selectNewTab(route);
		} else {
			this.selectNewTab("radio");
		}
		
		if (this.currentView) {
			this.$modal.modal("hide");
			this.currentView.remove();
			this.currentView = null;
		}
		
		if (this.currentStation) {
			this.currentStation.remove();
			this.currentStation = null;
		}
	},	
	
	after: function(route) {
		if (this.currentStation && this.stationHasChanged) {
			this.$content.html(this.currentStation.render().$el);
			this.stationHasChanged = false;
		}
		if (this.currentView) {
			var that = this;
			
			this.$modal.children(".modal-body").html(this.currentView.render().$el);
			$("#modal-title").text(this.currentView.title);
			this.$modal.modal('show')
				.on("shown", function() {
					if (that.currentView.isRadioIndex) {
						that.currentView.setupIsotope();
					}
				});
		}
	},
	
	routes: {
		"station/:id" : "radioStation",
				   "" : "radio"
	},
	
	hideModal: function() {
		this.$modal.modal("hide");
	},

	friends: function() {
		this.currentView = new SV.Views.ComingSoon();
	},
	
	favorites: function(calledFromOutside) {
		this.currentView = new SV.Views.FavoritesIndex({
			collection: SV.Store.currentUser ? SV.Store.currentUser.get("favorite_tracks") : null
		});
		if (calledFromOutside) {
			this.after();
		}
	},
	
	radio: function(calledFromOutside) {
		this.currentView = new SV.Views.RadioIndex({
			collection: SV.Store.radioStations
		});
		if (calledFromOutside) {
			this.after();
		}
	},
	
	radioStation: function(id) {
		var station = SV.Store.radioStations.findWhere({ id: parseInt(id) });
		this.currentStation = new SV.Views.RadioStation({
			model: station
		});
		this.stationHasChanged = true;
	},
	
	selectNewTab: function(route) {
		//	console.log("_"+route+"_")
		if (route === "") {
			route = "radio";
		}
		$("ul.nav").children().filter("li").removeClass("active");
		$("li#" + route).addClass("active");
	}
});
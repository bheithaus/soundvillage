window.SV = {
	Models: {},
	Collections: {},
	Routers: {},
	Views: {},
	Store: {},

	init: function($navbar, $content, $modal, radioStationsData, currentUserData) {
		//console.log(currentUserData);
		this.Store.radioStations = new SV.Collections.RadioStations(radioStationsData);
		if (currentUserData) {
			this.signIn(currentUserData);
		}
		
		this.router = new SV.Routers.SoundVillageRouter($content, $modal);
		this.makeNavbar($navbar);
		this.FBinit();
		this.connectSocket();
		
		//soundcloud SDK
		SC.initialize({
		  client_id: '1853d978ae73aae455ce18bf7c92f5dc'
		});
		
		Backbone.history.start();
	},
	
	makeNavbar: function($navbar) {
		this.navbarView = new SV.Views.Navbar();
		$navbar.html(this.navbarView.render().$el);
	},
	
	FBinit: function() {
		var fbSDKView = new SV.Views.FacebookSDK();
		$("body").prepend(fbSDKView.render().$el);
	},
	
	signIn: function(currentUserData) {
		this.Store.currentUser = new SV.Models.User(currentUserData);
	},
	
	connectSocket: function() {
		this.pusher = new Pusher('6a57463cf6800154ee3d');
	}
};
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
		this.initFB();
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
	
	initFB: function() {
		var fbSDKView = new SV.Views.FacebookSDK();
		$("body").prepend(fbSDKView.render().$el);
	},
	
	setFBConnected: function() {
		if (SV.Store.currentUser) {
			 if (SV.Store.currentUser.get("provider") !== "facebook") {
				 //hackity hack
				SV.Store.currentUser.save({ provider: "facebook", favorite_tracks_attributes: "no" }, {
					success: function() {
						SV.Store.currentUser.set("favorite_tracks_attributes", null);
					}
				});
			 }
			 Backbone.trigger("session");

			 FB.api('/me', function(response) {
			     console.log('Good to see you, ' + response.name + '.');
			 });
		}
	},
	
	connectFB: function() {
		if (window.FB) {
			FB.login(function(response) {
			   if (response.authResponse) {
  				   SV.setFBConnected();
			   } else {
			       console.log('User cancelled login or did not fully authorize.');
			   }
			 }, {scope: 'email, publish_stream'});
		} else {
			console.log("FB not initialized");
		}
	},
	
	signIn: function(currentUserData, reload_to_get_cookie) {
		this.Store.currentUser = new SV.Models.User(currentUserData);
		if (reload_to_get_cookie) {
			window.location.reload();
		}
	},
	
	connectSocket: function() {
		this.pusher = new Pusher('6a57463cf6800154ee3d');
	}
};
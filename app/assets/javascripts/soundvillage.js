window.SV = {
	Models: {},
	Collections: {},
	Routers: {},
	Views: {},
	Store: {},

	init: function($navbar, $content, radioStationsData, currentUserData) {
		console.log(currentUserData);
		this.Store.radioStations = new SV.Collections.RadioStations(radioStationsData);
		this.Store.currentUser = currentUserData ? new SV.Models.User(currentUserData) : null;
		
		this.router = new SV.Routers.SoundVillageRouter($content);
		this.makeNavbar($navbar);
		this.connectSocket();
		
		//soundcloud SDK
		SC.initialize({
		  client_id: '1853d978ae73aae455ce18bf7c92f5dc'
		});
		
		Backbone.history.start();
	},
	
	makeNavbar: function($navbar) {
		var navbarView = new SV.Views.Navbar();
		$navbar.html(navbarView.render().$el);
	},
	
	connectSocket: function() {
		this.pusher = new Pusher('6a57463cf6800154ee3d');
		// var channel = pusher.subscribe('my-channel');
	// 	channel.bind('my-event', function(data) {
	// 	  alert('An event was triggered with message: ' + data.message);
	// 	});
	}
};
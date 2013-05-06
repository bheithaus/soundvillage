window.SV = {
	Models: {},
	Collections: {},
	Routers: {},
	Views: {},
	Store: {},

	init: function($navbar, $content, currentUserData, usersData) {
		var that = this;

		this.router = new SV.Routers.SoundVillageRouter($content);
		that.makeNavbar($navbar);
		
		Backbone.history.start();
		// Current User stuff
// 		if (currentUserData) {
// 			CH.Store.currentUser = CH.Store.users.findWhere({
// 				id: currentUserData.id
// 			});
// 			CH.Store.currentUser.get("games").fetch();
// 			CH.pusher = new Pusher('2bfd0a96d75cfe730e81');
// 			//join presence channel for online users
// 			var presenceChannel = CH.pusher.subscribe('presence-channel');
// 			presenceChannel.bind('pusher:subscription_succeeded', function(member_list) {
// 				// var me = presenceChannel.members.me;
// // 				var userId = me.id;
// // 				var userInfo = me.info;
// // 				console.log(presenceChannel.members.count);
// 				console.log(member_list);
// 	  			_(member_list._members_map).each(function(member) {
// 	  						  		  			console.log(member);
// 	  						  		  		  CH.Store.onlineUsers.add(CH.Store.users.findWhere({ email: member.email }));
//   		  		});
// 				console.log(CH.Store.onlineUsers);
// 				
// 			});
// 			
// 			presenceChannel.bind('pusher:member_removed', function(member) {
// 				console.log("setting remove timeout");
// 				var memberID = member.id,
// 				timeoutID = setTimeout(function() {
// 					 console.log("removing sucka");
// 				  	 CH.Store.onlineUsers.remove(parseInt(member.id));
// 				}, 4000);
// 				
// 				var reAddedCallback = function(member) {
// 					presenceChannel.unbind('pusher:member_added');
// 					if (member.id == memberID) {
// 						console.log("clearingTimout");
// 						clearTimeout(timeoutID);
// 					}
// 				};
// 				
// 				presenceChannel.bind('pusher:member_added', reAddedCallback);
// 			});
// 			
// 			//when logged in bind to private channel for contacting this user only
// 			this.bindUserChannel();
// 		}
	},
	
	makeNavbar: function($navbar) {
		var that = this;
		
		var navbarView = new SV.Views.Navbar();
		
		$navbar.html(navbarView.render().$el);
	}
};
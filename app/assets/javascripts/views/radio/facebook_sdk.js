SV.Views.FacebookSDK = Backbone.View.extend({
	render: function() {
		this.$el.html("<div id='fb-root'></div>");	
		this.init();
		return this;
	},
	
	init: function () {
	    window.fbAsyncInit = function() {
	      // init the FB JS SDK
	      FB.init({
	        appId      : SV.paths.FBclientID,                        // App ID from the app dashboard
	        channelUrl : '//soundvillage.herokuapp.com/channel.html', // Channel file for x-domain comms
	        status     : true,                                 // Check Facebook Login status
	        xfbml      : true                                  // Look for social plugins on the page
	      });
		  
		  console.log()
		  
		  // FB.Event.subscribe('auth.authResponseChange', function(response) {
		  //   // Here we specify what we do with the response anytime this event occurs. 
		  //   if (response.status === 'connected') {
		  // 				SV.setFBConnected();
		  //   }
		  // });
	    };

	    // Load the SDK asynchronously
	    (function(d, s, id){
	       var js, fjs = d.getElementsByTagName(s)[0];
	       if (d.getElementById(id)) {return;}
	       js = d.createElement(s); js.id = id;
	       js.src = "//connect.facebook.net/en_US/all.js";
	       fjs.parentNode.insertBefore(js, fjs);
	     }(document, 'script', 'facebook-jssdk'));
	}
});
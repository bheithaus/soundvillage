SV.Views.FacebookShare = Backbone.View.extend({	
	events: {
		"click #fb-share": "shareToFB",
	},
	
	render: function() {
		var renderedContent = JST["radio/fb_share"]();
		this.$el.html(renderedContent);	
		
		return this;
	},
	
	setShared: function() {
		this.shareable = false;
		this.$("#fb-share .text").text("Shared");
	},
	
	disable: function() {
		this.shareable = false;
	},
	
	enable: function() {
		this.shareable = true;
		this.$("#fb-share .text").text("Share on Facebook");
	},
	
	shareToFB: function() {
		if (!SV.router.currentStation.nextSound || !this.shareable || !window.FB) {return;}
		
		var trackData = { title: SV.router.currentStation.nextSound.title,
						 artist: SV.router.currentStation.nextSound.user.username,
						    url: SV.router.currentStation.nextSound.permalink_url };
				 that = this;
							
		var params = {};
		params['message'] = "I'm listening to " + trackData.title + " by " + trackData.artist +
					" (" + trackData.url + ") on SoundVillage Radio!";
		params['name'] = "SoundVillage Internet Radio";
		params["link"] = 'http://soundvillage.herokuapp.com/' + window.location.hash;
		params['description'] = 'SoundVillage Radio, powered by www.soundcloud.com, a great way to discover independent electronic music!';
		params['picture'] = '';
		FB.api('/me/feed', 'post', params,
				function(response) {
					if (!response || response.error) {
						console.log('Error occured');
					} else {
						that.setShared();
					}
				}
		);
	}
});
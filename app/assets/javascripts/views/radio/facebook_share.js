SV.Views.FacebookShare = Backbone.View.extend({	
	events: {
		"click #fb-share": "shareToFB"
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
		if (!SV.router.currentStation.nextSound || !this.shareable) {return;}
		console.log(SV.router.currentStation.nextSound);
		console.log(SV.router.currentStation.model.get("name"));
		console.log(window.location.href);
		var trackData = { title: SV.router.currentStation.nextSound.title,
						 artist: SV.router.currentStation.nextSound.user.username,
						    url: SV.router.currentStation.nextSound.permalink_url },
		  stationData = { name: SV.router.currentStation.model.get("name"),
							 url: window.location.href },
				 that = this;
							
		$.post("/post_to_fb_wall",
				{ wall_post:
					{ track: trackData,
					station: stationData }
				},
				function(successData) {
					that.setShared();
					console.log(successData);
				}
		)
		.fail(function(failData) {
			
		});
	}
});
SV.Views.RadioStation = Backbone.View.extend({
	initialize: function() {
		this.isLoaded = false;
		this.waveUpdateInterval = 200;
		this.palette = [
						"#E01B6A",
						"#C91BE0",
						"#812B8C",
						"#8C2B5F",
						"#393BA8",
						"#5B26ED",
						"#C200AB"];
	},
	
	events: {
		"click button#new-station": "newStationModal",
		"click a#play" 		      : "playOrPause",
		"click a#skip" 		  	  : "skipToNextSound",
		"click a#favorite"		  : "favoriteTrack",
	},
	
	favoriteTrack: function(event) {
		if (this._isFavoriting || !this.isLoaded) {return;}
		this._isFavoriting = true;
		
		this.$favButton = this.$favButton || this.$("#favorite");
		
		var btnText,
			that = this
			favorited = SV.Store
						.currentUser.get("favorite_tracks").findWhere({
							url: this.nextSound.uri
						});
						
		if (favorited) {
			SV.Store.currentUser.get("favorite_tracks").remove(favorited);
			btnText = "<i class='icon-thumbs-up'></i>";
		} else {
			SV.Store.currentUser.get("favorite_tracks").add({
				artist: this.nextSound.user.username,
				title: this.nextSound.title,
				url: this.nextSound.uri
			});
			btnText = "<i class='icon-thumbs-down'></i>";
		}
		
		SV.Store.currentUser.save({}, {
			url: '/users',
			success: function(model, resp, options) {
				SV.Store.currentUser.get("favorite_tracks").reset(resp)
				that.$favButton.html(btnText);
			},
			error: function(model, xhr, options) {
				console.log(model);
				console.log(xhr);
			}
		});
		
		this._isFavoriting = false;
	},
	
	randomColor: function() {
		return this.palette[Math.floor(Math.random() * this.palette.length)];
	},
	
	SCAPIRequestError: function() {
		var $loadingText = $("<h4 id='loading'>Clones took over the network</h4>");
		this.$el.prepend($loadingText
							.css("color", "#C20202")
							.fadeIn(6000,
							function() {
								$loadingText.fadeOut("slow");
							}));
		this.spinner.stop();
	},

	setupPlayer: function() {
  		var	that = this,
			newSoundUrl;
		
		//handle API errors
		this.model.SCAPIRequestErrorCallback = this.SCAPIRequestError.bind(this);
		
		this.nextTrackCallback = function() {
			that.nextSound = that.model.nextTrack();
			if (that.nextSound.streamable) {
				newSoundUrl = that.nextSound.uri;
				SC.stream(newSoundUrl, {
					ontimedcomments: that.showComment.bind(that)
				},
				function(sound){
					that.setSound(sound);
				});
				that.showSoundDetails();
			} else {
				that.nextTrackCallback();
			}
  	  	};
		
		this.comments = 0;
		this.model.getUpcomingTracks(this.nextTrackCallback);
		this.setupSpinner();
		this.setLoading();
		this.setupVolumeSlider();
		this.bindBodyKeypresses();
  	},
	
	showComment: function(comments) {
		this.comments++;
		var comment = this.beautify(comments[0].body);
		if (this.comments % 5 == 0) {
			this.$comments.html(comment);
		} else {
			this.$comments.append(comment);
		}
	},
	
	beautify: function(comment) {
		return $("<strong> " + comment + " </strong>").css("color", this.randomColor());
	},
	
	clearSoundDetails: function() {
		this.$("#description").empty();
		this.$("#artwork").parent().empty().append("<img id='artwork' class='img-polaroid' alt='sound artwork'></img>");
		this.$comments.empty();
	},
	
	showSoundDetails: function() {
		var artworkSRC = this.nextSound.artwork_url || SV.assets.imageUrl('default-artwork.png');
		
		this.setFavButtonText();
		this.$("#description").html(this.formatDescription());
		this.$("#artwork").attr("src", artworkSRC)
						  .attr("height", "250")
						  .attr("width", "250");
	},
	
	visuallyEnableButtons: function() {
		$(".disabled").toggleClass("disabled");
		this.sharer.enable();
	},
	
	visuallyDisableButtons: function() {
		this.$("div#buttons .btn").toggleClass("disabled");
		this.sharer.disable();
	},
	
	setFavButtonText: function() {
		if (SV.Store.currentUser) {
			var btnText,
				favorited = SV.Store
							.currentUser.get("favorite_tracks").findWhere({
								url: this.nextSound.uri
							});
		
			btnText = favorited ? "<i class='icon-thumbs-down'></i>" : "<i class='icon-thumbs-up'></i>";
			this.$("#favorite").html(btnText);
		}
	},
	
	formatDescription: function() {
		var nextSound = this.nextSound;
		return "<h1><a class='special' target='_blank' href='"+ nextSound.permalink_url +"'>"+ nextSound.title + "</a></h1>" +
				"<h3><a class='special' target='_blank' href='"+ nextSound.user.permalink_url +"'>"+ nextSound.user.username + "</a></h3>" +
				"<p>" + String.prototype.autoLink.apply(nextSound.description.slice(0,500),[{ target: "_blank"}]) + "</p>"
	},
	
	showPosition: function() {
		clearInterval(this.trackerID);
		if (this.playing) {
			this.trackerID = setInterval(this.updateWaveform.bind(this),
								this.waveUpdateInterval);
		}
	},
	
	removeSound: function() {
		if (this.sound) {
			this.showPosition();
			this.sound.stop();
			this.sound.destruct();
		}
	},
	
	setSound: function(sound) {
		if (this.sound) {
			this.removeSound();
		}
		this.sound = sound;
		this.drawWaveform();
		this.sound.load({
			volume: 50,
			onfinish: this.finishedAndNextTrackCallback.bind(this),
		});
		this.isLoaded = true;
		this.start();
	},
	
	finishedAndNextTrackCallback: function() {
		//add tags to list!
		if (this.model.get("editable")) {
			this.model.addToWorkingTags();
			this.model.updateTags();
		}
		this.nextTrackCallback();
	},
	
	setLoading: function() {
		this.visuallyDisableButtons();
		var target = this.$('#loading').get(0);
		this.spinner.spin(target);
	},
	
	setupSpinner: function() {
		var opts = {
		  lines: 9, // The number of lines to draw
		  length: 15, // The length of each line
		  width: 5, // The line thickness
		  radius: 7, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 42, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#871342', // #rgb or #rrggbb
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: 'auto', // Top position relative to parent in px
		  left: 'auto' // Left position relative to parent in px
		};
		
		this.spinner = new Spinner(opts);
	},
	
	skipToNextSound: function() {
		if (this._isSkipping || !this.isLoaded) { return; }
		this._isSkipping = true;
		this.isLoaded = false;
		this.setLoading();
		
		this.removeSound();
		this.clearSoundDetails();
		this.nextTrackCallback();
		
		this._isSkipping = false;
	},
	
	start: function() {
		var that = this;
		setTimeout(function() {
			that.sound.setVolume(that.$("#volume").slider("option", "value"));
			that.visuallyEnableButtons();
			that.play();
			that.showPosition();
		}, 50);
	},
	
	play: function() {
		if (this._isPressingPlay || !this.isLoaded) { return; }
		this._isPressingPlay = true;
		
		this.spinner.stop();
		this.playing = true;
		this.sound.play();
		this.$("#play").html("<i class='icon-pause'></i>");
		
		this._isPressingPlay = false;
	},
	
	pause: function() {
		if (this._isPressingPause || !this.isLoaded) { return; }
		this._isPressingPause = true;
		
		this.playing = false;
		this.sound.pause();
		this.$("#play").html("<i class='icon-play'></i>");
		
		this._isPressingPause = false;
	},
	
	playOrPause: function() {
		if (this._isPlayingOrPausing || !this.isLoaded) { return; }
		this._isPlayingOrPausing = true;
		
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
		this.showPosition();
		
		this._isPlayingOrPausing = false;
	},
	
	bindBodyKeypresses: function() {
		$("body").on('keyup', this.spaceOrArrowPressed.bind(this));
	},
	
	spaceOrArrowPressed: function(event) {	
		if ($(event.target).context.localName === "input" || !this.isLoaded) { return; }

		if (event.keyCode === 32) {
			this.playOrPause();
		} else if (event.keyCode === 39) {
			this.skipToNextSound();
		}
	},
	
	installButtons: function() {
		this.setupVolumSlider();
	},
	
	// installPlayHandler: function() {
	// 	this.$("#play").on
	// 	sound.play();	
	// },
	
	setupVolumeSlider: function() {
		var slideCallback = function(event, ui) {
			this.sound.setVolume(ui.value);
		};
		
		this.slider = this.$("#volume").slider({
			orientation: "vertical",
			value: 50,
			slide: slideCallback.bind(this)
		});
	},
	
	drawWaveform: function() {
		var url = this.nextSound.waveform_url;
		this.canvas = this.$('#canvas').get(0);
		var ctx = this.ctx = this.canvas.getContext('2d'),
		   wave = this.wave =  new Image(),
		 height = this.canvas.height,
	   	  width = this.canvas.width;
		  
		   //background rect
		ctx.fillStyle = "#000000";
		 
	    ctx.clearRect(0, 0, width, height);   
	  	ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, width, height);
		wave.onload = function() {
							  	ctx.globalAlpha = 1;
		                    	ctx.drawImage(wave, 0, 0, width, height);
		                	}
		wave.src = url;
	},
	
	skipToEnd: function() {
		this.sound.setPosition(this.sound.durationEstimate - 100);	
	},
	
	updateWaveform: function() {
		var percentComplete = this.sound.position / this.sound.durationEstimate;
		
		var   height = this.canvas.height,
	   	       width = this.canvas.width,
		   		  dx = percentComplete * this.canvas.width,
				 ctx = this.ctx;
		   
		ctx.drawImage(this.wave, 0, 0, width, height);	
		ctx.fillStyle = "rgba(45, 45, 125, .4)";
		ctx.fillRect(0, 0, dx, height);
	},
	
	checkStationLoaded: function() {
		if (this.model.isLoaded) {
			clearTimeout(this.checkStationLoaded.bind(this));
			this.nextTrackCallback();
		} else {
			setTimeout(this.checkStationLoaded.bind(this), 300);
		}
	},
	
	newStationModal: function() {
		SV.navbarView.newStationModal();
	},
	
	remove: function() {
		$("window").off('keypress');
		clearInterval(this.trackerID);
		this.removeSound();
		this.model.removed = true;
	    this.model.unbind();
		this.$el.html("");
	    Backbone.View.prototype.remove.call(this);
	},
		
	render: function() {
		var renderedContent = JST["radio/station"]({
			station: this.model
		});
		
		var favButtonView = new SV.Views.FavButton();

		this.sharer = new SV.Views.FacebookShare();
		this.radioTagsView = new SV.Views.RadioTags({
			collection: new SV.Collections.Tags()
		});
		//console.log(this.model.get("name"));
		this.messagesView = new SV.Views.MessagesIndex({
			collection: new SV.Collections.Messages({}, {
				channelName: this.model.get("name")
			}),
		});
		
		this.$el.html(renderedContent)
				.append(this.radioTagsView.render().$el);
		this.$("#share-space").append(this.sharer.render().$el);
		this.$("#radio-inner")
			.append(this.messagesView.render().$el);
		this.$("#buttons").append(favButtonView.render().$el);
		
		this.$comments = this.$("#comments");
		this.setupPlayer();
	
		return this;
	}
});
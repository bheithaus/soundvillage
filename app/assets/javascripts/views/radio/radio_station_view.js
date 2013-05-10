SV.Views.RadioStation = Backbone.View.extend({
	initialize: function() {
		this.waveUpdateInterval = 200;
		this.palette = [
						"#E01B6A",
						"#C91BE0",
						"#812B8C",
						"#8C2B5F",
						"#393BA8",
						"#5B26ED",
						"#C200AB" ];
	},
	
	events: {
		"click button#new-station": "newStationModal",
		"click a#play" 		      : "playOrPause",
		"click a#skip" 		  	  : "nextSound",
		"click a#favorite"		  : "favoriteTrack"
	},
	
	favoriteTrack: function(event) {
		if (this._isFavoriting || !this.isLoaded) {return;}
		this._isFavoriting = true;
		
		var btnText;
		var $btn = $(event.target);
		var favorited = SV.Store
						.currentUser.get("favorite_tracks").findWhere({
							url: this.nextSound.uri
						});
						
		if (favorited) {
			SV.Store.currentUser.get("favorite_tracks").remove(favorited);
			btnText = "Favorite";
		} else {
			SV.Store.currentUser.get("favorite_tracks").add({
				artist: this.nextSound.user.username,
				title: this.nextSound.title,
				url: this.nextSound.uri
			});
			btnText = "Unfavorite";
		}
		
		SV.Store.currentUser.save({}, {
			url: '/users',
			success: function(model, resp, options) {
				console.log(resp)
				SV.Store.currentUser.get("favorite_tracks").reset(resp)
				$btn.html(btnText);
			}
		});
		
		this._isFavoriting = false;
	},
	
	randomColor: function() {
		return this.palette[Math.floor(Math.random() * this.palette.length)];
	},
	
	setupPlayer: function() {
  		var	that = this,
			newSoundUrl;
		
		//this is a callback!
		this.nextTrackCallback = function() {
			that.nextSound = that.model.nextTrack();
			newSoundUrl = that.nextSound.uri;
			
			console.log(that.nextSound);
			SC.stream(newSoundUrl, {
				ontimedcomments: that.showComment.bind(that)
			}, function(sound){
				that.setSound(sound);
			});
			that.showSoundDetails();
  	  	};
		
		this.comments = 0;
		this.model.getUpcomingTracks(this.nextTrackCallback);
		this.setupSpinner();
		this.setLoading();
		this.setupVolumeSlider();
  	},
	
	showComment: function(comments) {
		this.comments++;
		var comment = this.beautify(comments[0].body);
		if (this.comments % 5 == 0) {
			this.$comments.html(comment);
		} else {
			this.$comments.append(comment);
		}
		//console.log(comments[0].body);
	},
	
	beautify: function(comment) {
		return $("<strong> " + comment + " </strong>").css("color", this.randomColor());
	},
	
	clearSoundDetails: function() {
		this.$("#description").empty();
		this.$("#artwork").parent().empty().append("<img id='artwork'></img>");
		this.$comments.empty();
	},
	
	showSoundDetails: function() {
		this.setFavButtonText();
		this.$("#description").html(this.formatDetails());
		this.$("#artwork").attr("src", this.nextSound.artwork_url)
							.attr("height", "150")
							.attr("width", "150");
	},
	
	visuallyEnableButtons: function() {
		this.$("a#play").removeClass("disabled"); 	
		this.$("a#skip").removeClass("disabled"); 	
		this.$("a#favorite").removeClass("disabled");
	},
	
	visuallyDisableButtons: function() {
		this.$("a#play").addClass("disabled"); 	
		this.$("a#skip").addClass("disabled"); 	
		this.$("a#favorite").addClass("disabled");
	},
	
	setFavButtonText: function() {
		var btnText,
			favorited = SV.Store
						.currentUser.get("favorite_tracks").findWhere({
							url: this.nextSound.uri
						});
		
		btnText = favorited ? "Unfavorite" : "Favorite";
		this.$("#favorite").html(btnText);
	},
	
	formatDetails: function() {
		var nextSound = this.nextSound;
		return "<h1><a href='"+ nextSound.permalink_url +"'>"+ nextSound.title + "</a></h1>" +
				"<h3><a href='"+ nextSound.user.permalink_url +"'>"+ nextSound.user.username + "</a></h3>" +
				"<p>" + nextSound.description + "</p>"
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
			onfinish: this.nextTrackCallback,
		});
		this.isLoaded = true;
		this.start();
	},
	
	setLoading: function() {
		this.visuallyDisableButtons();
		var target = this.$('#loading').get(0);
		this.spinner.spin(target);
	},
	
	setupSpinner: function() {
		var opts = {
		  lines: 9, // The number of lines to draw
		  length: 8, // The length of each line
		  width: 5, // The line thickness
		  radius: 7, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 42, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#000', // #rgb or #rrggbb
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
	
	nextSound: function() {
		if (this._isSkipping || !this.isLoaded) { return; }
		this._isSkipping = true;
		
		this.removeSound();
		this.clearSoundDetails();
		this.nextTrackCallback();
		
		this._isSkipping = false;
	},
	
	start: function() {
		var that = this;
		setTimeout(function() {
			that.sound.setVolume(that.$("#volume").slider("option", "value"));
			that.spinner.stop();
			that.visuallyEnableButtons();
			that.play();
			that.showPosition();
		}, 50);
	},
	
	play: function() {
		this.spinner.stop();
		this.playing = true;
		console.log("current song");
		console.log(this.sound);
		this.sound.play();
		this.$("#play").text("Pause");
	},
	
	pause: function() {
		this.playing = false;
		this.sound.pause();
		this.$("#play").text("Play");
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
		console.log(this.playing);
		
		this._isPlayingOrPausing = false;
	},
	
	installButtons: function() {
		this.setupVolumSlider();
	},
	
	installPlayHandler: function() {
		this.$("#play").on
		sound.play();	
	},
	
	setupVolumeSlider: function() {
		var slideCallback = function(event, ui) {
			this.sound.setVolume(ui.value);
		};
		
		console.log('setting up slider?')
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
	
	updateWaveform: function() {
		var percentComplete = this.sound.position / this.sound.durationEstimate;
		
		var   height = this.canvas.height,
	   	       width = this.canvas.width,
		   		  dx = percentComplete * this.canvas.width,
				 ctx = this.ctx;
		   
		ctx.drawImage(this.wave, 0, 0, width, height);	
		ctx.fillStyle = "rgba(45, 45, 125, .4)";
		ctx.fillRect(0, 0, dx, height);
         //then set the global alpha to the amound that you want to tint it, and draw the buffer directly on top of it.
	},
	
	checkStationLoaded: function() {
		if (this.model.isLoaded) {
			clearTimeout(this.checkStationLoaded.bind(this));
			this.nextTrackCallback();
		} else {
			setTimeout(this.checkStationLoaded.bind(this), 300);
		}
	},
	
	enterPressed: function(event) {
		// console.log(event.keyCode)
// 		console.log(event.target);
	},
	
	newStationModal: function() {
		//console.log("this is happening");
		var newStation = new SV.Models.RadioStation();
				
		var newStationForm = new SV.Views.NewRadioStationForm({
			model: newStation,
		})
		this.$("#new-station-modal").children().first().html(newStationForm.render().$el);
		this.$("#new-station-modal").modal();
		//load a modal
	},
	
	remove: function() {
		this.removeSound();
	    this.model.unbind();
	    Backbone.View.prototype.remove.call(this);
	},
		
	render: function() {
		var renderedContent = JST["radio/station"]({
			station: this.model
		});		
		
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
				.append(this.radioTagsView.render().$el)
				.append(this.messagesView.render().$el);
		
		this.$comments = this.$("#comments");
		this.setupPlayer();
	
		return this;
	}
});
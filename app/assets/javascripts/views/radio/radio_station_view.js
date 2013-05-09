SV.Views.RadioStation = Backbone.View.extend({	
	events: {
		"click button#new-station"    : "newStationModal",
		"click button#play" 		  : "playOrPause",
		"click button#skip" 		  : "nextSound"
	},
	
	setupPlayer: function() {
        var newSoundUrl,
  			that = this;
			
		SC.initialize({
		  client_id: '1853d978ae73aae455ce18bf7c92f5dc'
		});
		
		this.nextTrackCallback = function() {
			this.nextSound = that.model.nextTrack();

			newSoundUrl = nextSound.uri;
			SC.stream(newSoundUrl, function(sound){
				that.setSound(sound);
			});
			that.showSoundDetails();
  	  	};
  	  	
		this.model.getUpcomingTracks(this.nextTrackCallback);
		this.setupSpinner();
		this.setLoading();
		this.setupVolumeSlider();
  	},
	
	clearSoundDetails: function() {
		this.$("#description").empty();
		this.$("#artwork").parent().empty().append("<img id='artwork'></img>");
	},
	
	showSoundDetails: function() {
		var nextSound = this.nextSound;
		
		this.$("#description").html(this.formatDetails(nextSound));
		this.$("#artwork").attr("src", nextSound.artwork_url)
							.attr("height", "200")
							.attr("width", "200");
	},
	
	formatDetails: function() {
		var nextSound = this.nextSound;
		return "<h1><a href='"+ nextSound.permalink_url +"'>"+ nextSound.title + "</a></h1>" +
				"<h3><a href='"+ nextSound.user.permalink_url +"'>"+ nextSound.user.username + "</a></h3>" +
				"<p>" + nextSound.description + "</p>"
	},
	
	showPosition: function() {
		if (this.playing) {
			this.trackerID = setInterval(this.updateWaveform.bind(this), 100);
		} else {
			clearInterval(this.trackerID);
		}
	},
	
	removeSound: function() {
		if (this.sound) {
			this.sound.stop();
			this.sound.destruct();
		}
	},
	
	setSound: function(sound) {
		if (this.sound) {
			this.removeSound();
		}
		this.sound = sound;
		this.drawWaveform(nextSound);
		this.sound.load({
			volume: 50,
			onfinish: this.nextTrackCallback,
		});
		this.isLoaded = true;
		this.start();
	},
	
	setLoading: function() {
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
		if (this._isSkipping) { return; }
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
		console.log(this._isPlayingOrPausing);
		
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
		   wave = new Image(),
		 height = this.canvas.height,
	   	  width = this.canvas.width;
      	this.dx = width * 100 / ( this.sound.durationEstimate );
		  
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
	   	   completed = this.canvas.width * percentComplete;
				
		   this.ctx.fillStyle = "rgba(45, 45, 125, .1)";
		   this.ctx.fillRect(completed, 0, this.dx, height);
         //then set the global alpha to the amound that you want to tint it, and draw the buffer directly on top of it.
	},
	
	checkStationLoaded: function() {
		console.log("chekjin")
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
			newStationCallback: this.removeSound.bind(this)
		})
		this.$("#new-station-modal").children().first().html(newStationForm.render().$el);
		this.$("#new-station-modal").modal();
		//load a modal
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
				
		this.setupPlayer();
		
		return this;
	}
});
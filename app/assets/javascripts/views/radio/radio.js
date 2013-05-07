SV.Views.Radio = Backbone.View.extend({
	intitialize: function() {
			
	},
	
	events: {
		"click button#new-station"    : "newStationModal"
	},
	
	setupPlayer: function () {
      var widgetIframe = this.$("#sc-widget").get(0),
          widget       = SC.Widget(widgetIframe),
          newSoundUrl = 'http://api.soundcloud.com/tracks/13692671';

	  var nextTrackCallback = function () {
		  newSoundUrl = that.upcomingTracks.shift().uri;
          widget.load(newSoundUrl, {
 			   auto_play: true,
            show_artwork: false
          });
	  };

      widget.bind(SC.Widget.Events.READY, function() {
        // load new widget
        widget.bind(SC.Widget.Events.FINISH, nextTrackCallback);
      });
	},
	
	enterPressed: function(event) {
		console.log(event.keyCode)
		console.log(event.target);
	},
	
	newStationModal: function() {
		console.log("this is happening");
		var newStation = new SV.Models.RadioStation();
		
		var newStationForm = new SV.Views.NewRadioStationForm({
			model: newStation
		})
		this.$("#new-station-modal").children().first().html(newStationForm.render().$el);
		$("#new-station-modal").modal();
		//load a modal
	},
		
	render: function() {
		var renderedContent = JST["radio/main"]();
		this.radioTagsView = new SV.Views.RadioTags({
			collection: new SV.Collections.Tags()
		});
		console.log(this.model.get("name"));
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
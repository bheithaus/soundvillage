SV.Views.Radio = Backbone.View.extend({
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
	  
	  var client_id = '1853d978ae73aae455ce18bf7c92f5dc'
	  var url = 'https://api.soundcloud.com/tracks.json?client_id=' + client_id + '&tags='+ 'dance' +'&order_by=hotness';
	  var that = this;
	  $.getJSON(
		  url,
		  function (data) {
			  that.upcomingTracks = data;
		  }
	  );
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
		
		this.$el.html(renderedContent)
				.append(this.radioTagsView.render().$el);
				
		this.setupPlayer();
		
		return this;
	}
});
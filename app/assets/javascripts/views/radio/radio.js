SV.Views.Radio = Backbone.View.extend({
	events: {
		"click button#new-station" : "newStation"
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
	
	newStation: function() {
		console.log("this is happening")
		var stationName = $("#station-name").val();
		
		var newStation = new SV.Models.RadioStation({
			name: stationName
		});
		
		$('.radio-station-tag').each(function(i, tagField) {
			console.log($(tagField).val());
			newStation.get("tags").add(new SV.Models.Tag({
				name: $(tagField).val()
			}));
		});
		
		newStation.save({
			success: function(data) {
				console.log(data);
			}
		});
		//load a modal
	},
		
	render: function() {
		var renderedContent = JST["radio/main"]();
		var radioTagsView = new SV.Views.RadioTags();
		
		this.$el.html(renderedContent)
				.append(radioTagsView.render().$el);
				
		this.setupPlayer();
		
		return this;
	}
});
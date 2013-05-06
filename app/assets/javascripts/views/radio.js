SV.Views.Radio = Backbone.View.extend({
	setupPlayer: function () {
      var widgetIframe = this.$("#sc-widget").get(0),
          widget       = SC.Widget(widgetIframe),
          newSoundUrl = 'http://api.soundcloud.com/tracks/13692671';

	  var nextTrackCallback = function () {
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
		
	render: function() {
		var renderedContent = JST["radio/main"]();
		var radioTagView = new SV.Views.RadioTag();
		
		this.$el.html(renderedContent)
				.append(radioTagView.render().$el);
				
		this.setupPlayer();
		
		return this;
	}
});
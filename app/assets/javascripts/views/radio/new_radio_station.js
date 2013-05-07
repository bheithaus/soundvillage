SV.Views.NewRadioStationForm = Backbone.View.extend({
	events: {
		"keypress #radio-station-tag" : "enterPressed",
		"click button#commit" 		  : "createStation"
	},
	
	createStation: function() {
		console.log("this is happening")
		this.model.set({ name: $("#station-name").val() });
	
		this.model.save({}, {
			success: function(data) {
				console.log(data);
			}
		});
	},
	
	enterPressed: function(event) {
		if (event.keyCode == 13) {
			this.addTag($(event.target).val());
			$(event.target).val("");
		}
		console.log(event.keyCode)
		console.log(event.target);
	},
	
	addTag: function(tag) {
		this.model.get("tags").add({ name: tag });
	},
	
	render: function() {
		var renderedContent = JST["radio/new_station_form"]();
		var radioTagsView = new SV.Views.RadioTags({
			collection : this.model.get("tags")
		});
		this.$el.html(renderedContent)
				.append(radioTagsView.render().$el);
			
		return this;
	}
});
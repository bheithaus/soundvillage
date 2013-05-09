SV.Views.NewRadioStationForm = Backbone.View.extend({
	initialize: function(options) {
		this.newStationCallback = options.newStationCallback;
	},
	
	events: {
		"keypress #station-tag" : "enterPressed",
		"click button#commit" 		  : "createStation"
	},
	
	createStation: function() {
		// console.log("this is happening")
		this.model.set({
			name: this.$("#station-name").val(),
			genre: this.$("#station-genre").val()
		});
		
		console.log(this.model);
		
		var tag = this.$("#station-tag").val();
		if (tag) {
			this.addTag(tag);
		}
		
		var that = this;	
		this.model.save({}, {
			success: function(savedStationData) {
				SV.Store.radioStations.add(savedStationData);
				if (that.newStationCallback) {
					that.newStationCallback();
				}
				$("#new-station-modal").modal('hide');
				Backbone.history.navigate("radio/" + savedStationData.id,
											{ trigger: true });
			}
		});
	},
	
	enterPressed: function(event) {
		if (event.keyCode == 13) {
			this.addTag($(event.target).val());
			$(event.target).val("");
		}
		// console.log(event.keyCode)
// 		console.log(event.target);
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
SV.Views.NewRadioStationForm = Backbone.View.extend({	
	events: {
		"keypress #station-tag" : "enterPressed",
		"click button#commit"   : "createStation"
	},
	
	createStation: function() {
		this.model.set({
			name: this.$("#station-name").val(),
			editable: this.$("#editable").prop("checked")
		});
				
		var tag = this.$("#station-tag").val();
		if (tag) {
			//default weight of 4
			this.model.addTag(tag, 4);
		}
		
		var that = this;	
		this.model.save({}, {
			success: function(savedStationData) {
				SV.Store.radioStations.add(savedStationData);
				$("#new-station-modal").modal('hide');
				Backbone.history.navigate("station/" + savedStationData.id,
											{ trigger: true });
			}
		});
	},
	
	enterPressed: function(event) {
		if (event.keyCode == 13) {
			this.model.addTag($(event.target).val(), 4);
			$(event.target).val("");
		}
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
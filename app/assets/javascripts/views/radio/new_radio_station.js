SV.Views.NewRadioStationForm = Backbone.View.extend({	
	events: {
		"keypress #station-tag" : "enterPressed",
		"click button#commit" 		  : "createStation"
	},
	
	createStation: function() {
		// console.log("this is happening")
		this.model.set({
			name: this.$("#station-name").val(),
			genre: this.$("#station-genre").val(),
			editable: this.$("#editable").prop("checked")
		});
		
		console.log("checked " + this.$("#editable").prop("checked"));
		
		console.log(this.model);
				
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
				Backbone.history.navigate("radio/" + savedStationData.id,
											{ trigger: true });
			}
		});
	},
	
	enterPressed: function(event) {
		if (event.keyCode == 13) {
			this.model.addTag($(event.target).val(), 4);
			$(event.target).val("");
		}
		// console.log(event.keyCode)
// 		console.log(event.target);
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
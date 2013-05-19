SV.Views.RadioIndex = Backbone.View.extend({	
	events: {
		"click a"    : "selectStation",
		"click button#new-station"    : "newStationModal",
	},
	
	render: function() {
		var renderedContent = JST["radio/index"]({
			stations: this.collection
		});
		this.$el.html(renderedContent);
		
		return this;
	},
	
	newStationModal: function() {
		//console.log("this is happening");
		var newStation = new SV.Models.RadioStation();
				
		var newStationForm = new SV.Views.NewRadioStationForm({
			model: newStation,
		})
		this.$("#new-station-modal .modal-body").html(newStationForm.render().$el);
		this.$("#new-station-modal").modal();
		//load a modal
	},
	
});
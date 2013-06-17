SV.Views.NewRadioStationForm = Backbone.View.extend({
	initialize: function() {
		var renderStationNameCallback = this.renderStationName.bind(this);
		
		this.listenTo(this.model, "change", renderStationNameCallback);
		
		this.setupSpinner();
	},
	
	events: {
		"keypress #station-tag"  : "enterPressedTag",
		"keypress #track-search" : "enterPressedSearch",
		"keyup input#station-name": "updateStationName",
		"click #track-results"   : "selectTrack",
		"click button#commit"    : "createStation",
	},
	
	updateStationName: function() {
		this.model.set("name", this.$stationNameInput.val());
	},
	
	renderStationName: function() {
		this.$stationNameOutput.text(this.model.get("name"));
	},
	
	createStation: function() {
		var tag = this.$("#station-tag").val();
		if (!tag && this.model.get("tags").length == 0) {return;}
		
		this.model.set({
			name: this.$stationNameOutput.text(),
			// might make editable not an option for track based station...?
			editable: this.$("#editable").prop("checked")
		});
				
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
	
	enterPressedTag: function(event) {
		if (event.keyCode == 13) {
			this.model.addTag($(event.target).val(), 4);
			$(event.target).val("");
		}
	},
	
	enterPressedSearch: function(event) {
		var that = this;
		if (event.keyCode == 13) {
			var searchQuery = $("#track-search").val();
			if (searchQuery.length >= 3) {
				that.setLoading();
				SC.get('/tracks', { q: searchQuery, license: 'cc-by-sa' }, function(tracks) {
					console.log(tracks);
					if (tracks.length) {
						that.$searchError.html("");
						that.trackResults = tracks;
						that.injectSearchResults();
					} else {
						that.searchError();
					}

					that.unsetLoading();
				});
			}
		}
	},
	
	searchError: function() {
		this.$searchError.html("There was an error with your search");
	},
	
	setLoading: function() {
		var target = this.$('#searching-tracks-spinner').get(0);
		this.spinner.spin(target);
	},
	
	unsetLoading: function() {
		this.spinner.stop();
	},
	
	setupSpinner: function() {
		var opts = {
		  lines: 9, // The number of lines to draw
		  length: 5, // The length of each line
		  width: 3, // The line thickness
		  radius: 7, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 42, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#871342', // #rgb or #rrggbb
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: '-20', // Top position relative to parent in px
		  left: '230' // Left position relative to parent in px
		};
		
		this.spinner = new Spinner(opts);
	},
	
	injectSearchResults: function() {
		var that = this,
		tracks = this.trackResults;
		
		this.$trackResults.html('');
		_(tracks).each(function(track) {
			that.$trackResults.append("<tr><td data-id=" + track.id + ">" + track.title + "</td></tr>");
		});
	},
	
	selectTrack: function(event) {
		var track = _(this.trackResults).findWhere({ id: $(event.target).data("id") });
		this.addTrackToStation(track);
	},
	
	cleanTags: function(track) {
		var tags, tagString, that = this;
		
		tagString = track.tag_list || track.permalink.replace(/-/g, " "); 
		return _(tagString.split(" ")).map(function(tag) {
			tag.replace(/\"/g, "");
			tag.replace(/\'/g, "");
			return { name: tag, weight: 4 };
		});
		this.model.get("tags").reset(tags);
	},
	
	addTrackToStation: function(track) {
		this.model.get("tags").reset(this.cleanTags(track));
		this.model.set("image_url", track.artwork_url);
		this.model.set("name", track.title);
	},
	
	render: function() {
		var renderedContent = JST["radio/new_station_form"]();
		var radioTagsView = new SV.Views.RadioTags({
			collection : this.model.get("tags")
		});
		this.$el.html(renderedContent);
		this.$("#tagSpace").append(radioTagsView.render().$el);
		
		//store pointer to critical $(DOM element)
		this.$trackResults = this.$("#track-results");
		this.$stationNameInput = this.$("#station-name");
		this.$stationNameOutput = this.$("#station-name-output");
		this.$searchError = this.$("#search-error");
		
		return this;
	}
});
SV.Views.RadioIndex = Backbone.View.extend({	
	initialize: function() {
		this.stations = [];
		this.isRadioIndex = true;
		this.title = "Radio Stations";
	},
	
	events: {
		"keyup #filter"	  		    	  : "isotopeSearch",
		"click a"   		 			  : "selectStation",
		"click button#new-station-index"  : "newStationModal",
	},
	
	render: function() {
		var renderedContent = JST["radio/index"]({
			stations: this.collection
		});
		this.$el.html(renderedContent);
		return this;
	},
	
	setupIsotope: function() {
		this.$container = this.$('#stations');
		this.$container.isotope({
			layoutMode: 'masonry',
			masonry: {
				columnWidth: 180,
			},
			itemSelector : '.radio-station'
		});
		
		var that = this;
	    this.collection.each(function(station){
				var tmp = {};
				tmp.id = station.get('id');
				tmp.name = station.get("name").toLowerCase();
				that.stations.push( tmp );
	    });

		this.$('#showAll').click(function(){
		       that.$('#filter').val(''); // reset input el value
		       that.isotopeSearch(false); // restores all items
		       return false;   
		});
	},
	
	isotopeSearch: function() {
			//thanks to Charlie Perrins
			var kwd = this.$("#filter").val().toLowerCase(),
	        // reset results arrays
	        matches = [],
	       	 misses = [];
	
	        this.$('.radio-station').removeClass('match miss'); // get rid of any existing classes
	        $('#noMatches').hide(); // ensure this is always hidden when we start a new query

	        if ( (kwd != '') && (kwd.length >= 2) ) { // min 2 chars to execute query:
	                // loop through items array             
	                _.each(this.stations, function(station){
	                        if ( station.name.indexOf(kwd) !== -1 ) { // keyword matches element
	                                matches.push( $('#station-'+station.id)[0] );
	                        } else {
	                                misses.push( $('#station-'+station.id)[0] );
	                        }
	                });
                	
	                $(matches).addClass('match');
	                $(misses).addClass('miss');
	                this.$container.isotope({ filter: $(matches) }); // isotope.filter will take a jQuery object instead of a class name as an argument - sweet!
	                if (matches.length == 0) {
	                        $('#noMatches').show(); // deal with empty results set
	                }
                
	        } else {
	                // show all if keyword less than 2 chars
	                this.$container.isotope({ filter: '.radio-station' });
	        }
	},
	
	newStationModal: function() {
		SV.router.$modal.modal("hide");
		SV.navbarView.newStationModal();
	},
});
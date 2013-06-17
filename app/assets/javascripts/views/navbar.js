SV.Views.Navbar = Backbone.View.extend({
	initialize: function() {
		var sessionCallback = this.sessionCallback.bind(this);
		this.listenTo(Backbone, "session", sessionCallback);
	},
	
	events: {
		"click .signin" : "signInModal",
		"click #commit-signin" : "signIn",
		"keypress #password" : "enterPressedSignIn",
		"keypress #su-password-confirm" : "enterPressedSignUp",
		"click #commit-signup" : "signUp",
		"click #signup" : "signUpModal",
		"click #signout" : "signOut",
		"click #favorites": "favoritesModal",
		"click #radio": "radioModal",
		"click #connect-fb": "connectFB",
	},
	
	sessionCallback: function() {
		this.render();
		this.fbCallback();
	},
	
	render: function() {
		var renderedContent = JST["nav/navbar"]();
		this.$el.html(renderedContent);
		
		return this;
	},
	
	connectFB: function() {
		
		//use FB JS SDK
		if (window.FB) {
			FB.login(function(response) {
			   if (response.authResponse) {
				   
				 // need to track auth another way..
		 		 SV.Store.currentUser.set("provider", "facebook");
				 
				 Backbone.trigger("session");
				 
			     FB.api('/me', function(response) {
			         console.log('Good to see you, ' + response.name + '.');
			     });
			   } else {
			     console.log('User cancelled login or did not fully authorize.');
			   }
			 }, {scope: 'email,publish_stream'});
		} else {
			console.log("FB not initialized");
		}
		
		
		// newwindow = window.open(SV.paths.facebook_omniauth_url, 'Connect Facebook',
// 								'height=400,width=500');
// 		if (window.focus) { newwindow.focus(); }
	},
	
	fbCallback: function() {
		if (SV.router.currentStation) {
			SV.router.currentStation.sharer.render();
		}
	},
	
	favoritesModal: function() {
		console.log("calling favorites");
		SV.router.favorites(true);
	},
	
	radioModal: function() {
		SV.router.radio(true);
	},
	
	enterPressedSignIn: function(event) {
		if (event.keyCode === 13) {
			this.signIn();
		}
	},
	
	enterPressedSignUp: function(event) {
		if (event.keyCode === 13) {
			this.signUp();
		}
	},
	
	signInModal: function() {
		console.log(this.$("#sign-in-modal"));
		this.$("#sign-up-modal").modal("hide");
		this.$("#sign-in-modal").modal();
	},
	
	signUpModal: function() {
		this.$("#sign-in-modal").modal('hide');
		this.$("#sign-up-modal").modal();
	},
	
	signIn: function() {
		this.$("#email").val();
		this.$("#password").val();
		var remember = this.$("#remember-me").is(":checked") ? 1 : 0,
				that = this;

		$.post(
			"/users/sign_in",
			{ user: {
				email: this.$("#email").val(),
				password: this.$("#password").val(),
				remember_me: remember
			}}
		).success(
			function(userSessionData) {	
				console.log(userSessionData);
				SV.signIn(userSessionData);
				that.$("#sign-in-modal").modal("hide");
				Backbone.trigger("session");
			}
		).fail(function(xhr) {
			$("#si-alert").html(that.prettyErrors(xhr));
		});
	},
	
	signOut: function() {
		var that = this;

		$.post(
			"/users/sign_out",
			{
				"_method" : "delete",
			}
		).success(
			function(data) {
				console.log(data);
				SV.Store.currentUser.clear();
				SV.Store.currentUser = null;
				Backbone.trigger("session");
			}
		);
	},
	
	signUp: function() {
		var that = this;
		$.post(
			"/users",
			{ user: {
				email: this.$("#su-email").val(),
				password: this.$("#su-password").val(),
				password_confirmation: this.$("#su-password-confirm").val()
			}},
			function(userSessionData) {
				SV.signIn(userSessionData);
				that.$("#sign-up-modal").modal("hide");
				Backbone.trigger("session");
			}
		).fail(function(xhr, text, statusCode) {
			$("#su-alert").html(that.prettyErrors(xhr));
		});
	},
	
	prettyErrors: function(xhr) {
		console.log(xhr);	
		if (xhr.responseText.match(/:/)) {
			var errorsJSON = $.parseJSON(xhr.responseText);
			errorsString,
			errorsList = _(errorsJSON).map(function(errors, field) {
				return "<li>" + field + " " + errors.join(", and ") + "</li>";
			});
		} else {
			var errorsList = xhr.responseText;
		}
		
		return "<ul id='errors' class='unstyled'>" + errorsList + "</ul>";
	},
	
	newStationModal: function() {
		var newStation = new SV.Models.RadioStation(),
				  that = this;
				
		var newStationForm = new SV.Views.NewRadioStationForm({
			model: newStation,
		});
		this.$("#new-station-modal").on('shown', function () {
			that.$("#station-name").focus();
		});
		this.$("#new-station-modal .modal-body").html(newStationForm.render().$el);
		
		this.$("#new-station-modal").modal();
	},
});
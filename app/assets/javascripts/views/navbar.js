SV.Views.Navbar = Backbone.View.extend({
	initialize: function() {
		var renderCallback = this.render.bind(this);
		this.listenTo(Backbone, "session", renderCallback);
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
	
	render: function() {
		var renderedContent = JST["nav/navbar"]();
		this.$el.html(renderedContent);
		
		return this;
	},
	
	connectFB: function() {
		newwindow = window.open(SV.paths.facebook_omniauth_url, 'Connect Faceboon',
								'height=200,width=150');
		if (window.focus) { newwindow.focus(); }
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
		);
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
				that.trigger("session");
			}
		).fail(function(xhr, errorText) {
			console.log(xhr);
			console.log(errorText);
		});
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
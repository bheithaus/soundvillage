SV.Views.Navbar = Backbone.View.extend({
	initialize: function() {
		var renderCallback = this.render.bind(this);
		this.listenTo(this, "session", renderCallback);
	},
	
	events: {
		"click #signin" : "signInModal",
		"click #commit-signin" : "signIn",
		"keypress #password" : "enterPressedSignIn",
		"keypress #su-password-confirm" : "enterPressedSignUp",
		"click #commit-signup" : "signUp",
		"click #signup" : "signUpModal",
		"click #signout" : "signOut"
	},
	
	render: function() {
		var renderedContent = JST["nav/navbar"]();
		this.$el.html(renderedContent);
		
		return this;
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
				that.trigger("session");
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
				that.trigger("session");
			}
		);
	},
	
	signUp: function() {
		$.post(
			"/users",
			{ user: {
				email: this.$("#su-email").val(),
				password: this.$("#su-password").val(),
				password_confirmation: this.$("#su-password-confirm").val()
			}},
			function(successData) {
				window.location = "/";
			}
		);
	}
});
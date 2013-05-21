SV.Views.Navbar = Backbone.View.extend({
	events: {
		"click .signin" : "signInModal",
		"click #commit-signin" : "signIn",
		"click #commit-signup" : "signUp",
		"click #signup" : "signUpModal",
		"click #signout" : "signOut"
	},
	
	render: function() {
		var renderedContent = JST["nav/navbar"]();
		this.$el.html(renderedContent);
		
		return this;
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
		var remember = this.$("#remember-me").is(":checked") ? 1 : 0;

		$.post(
			"/users/sign_in",
			{ user: {
				email: this.$("#email").val(),
				password: this.$("#password").val(),
				remember_me: remember
			}},
			function(successData) {
				window.location = "/";
			}
		)
	},
	
	signOut: function() {
		$.post(
			"/users/sign_out",
			{
				"_method" : "delete",
				
			},
			function() {
				window.location = "/";
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
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    @connection = current_user.connect_with_facebook_oauth(request.env["omniauth.auth"])
  end
end
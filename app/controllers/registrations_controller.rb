class RegistrationsController < Devise::RegistrationsController 
  include RedisHelper
  respond_to :json, :html
  
  def create
    build_resource(params[:user])

    if resource.save
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        render json: resource
      else
        # expire_session_data_after_sign_in!
 #        respond_with resource, :location => after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      render json: resource.errors, status: 422
    end
  end
  
  def update
    #this is fun, I am using this method only to favorite / unfavorite tracks
    puts "CURRENT USER"
    p current_user
    @user = User.find(current_user.id)
    attrs = {}
    attrs[:favorite_track_ids] = []
    tracks = []
    
    if (params[:user][:favorite_tracks_attributes])
        params[:user][:favorite_tracks_attributes].each do |trackData|
          track = FavoriteTrack.find_or_create_by_url_and_title_and_artist(
                                trackData[:url],
                                trackData[:title],
                                trackData[:artist])

          attrs[:favorite_track_ids] << track.id
          tracks << track
        end
    
        if @user.update_attributes(attrs)
          reset_redis_user_and_favorites
          # Sign in the user bypassing validation in case his password changed
          render json: tracks
        else
          render json: {}, status: 422
        end
    else
      render json: {}, status: 422
    end
  end
  
  protected

  # Build a devise resource passing in the session. Useful to move
  # temporary session data to the newly created user.
  def build_resource(hash=nil)
    self.resource = resource_class.new_with_session(hash || {}, session)
  end

  # Signs in a user on sign up. You can overwrite this method in your own
  # RegistrationsController.
  def sign_up(resource_name, resource)
    sign_in(resource_name, resource)
  end

  # Authenticates the current scope and gets the current resource from the session.
  def authenticate_scope!
    send(:"authenticate_#{resource_name}!", :force => true)
    self.resource = send(:"current_#{resource_name}")
  end

  def sign_up_params
    devise_parameter_sanitizer.for(:sign_up)
  end
end
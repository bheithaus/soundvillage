class RegistrationsController < Devise::RegistrationsController
  respond_to :json, :html
  
  def create
    super
  end
  
  def update
    #this is fun, I am using this method only to favorite / unfavorite tracks
    
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
          puts "response from find or create by url"
          p track
          attrs[:favorite_track_ids] << track.id
          tracks << track
        end
    end
    
    
    if @user.update_attributes(attrs)
      set_flash_message :notice, :updated
      # Sign in the user bypassing validation in case his password changed
      render json: tracks
    else
      render json: {}, status: 422
    end
  end
end
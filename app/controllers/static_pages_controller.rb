class StaticPagesController < ApplicationController
  def app
    @radio_stations = RadioStation.includes(:tags).all
    if current_user
      @current_user = User.includes(:favorite_tracks).find_by_email(current_user.email)
    end
        
    respond_to do |format|
      format.html
      format.json { render json: current_user }
    end
  end
end

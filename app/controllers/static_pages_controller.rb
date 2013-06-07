class StaticPagesController < ApplicationController
  include RedisHelper
  
  def app
    @radio_stations_json = public_stations
    if current_user
      @current_user_json = current_user_and_favorite_tracks #in AppCtrl
    end
        
    respond_to do |format|
      format.html
      format.json { render json: current_user }
    end
  end
end

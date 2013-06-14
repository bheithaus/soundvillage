class StaticPagesController < ApplicationController
  include RedisHelper
  
  def app
    p params
    @radio_stations_json = public_stations.html_safe
    @current_user_json = current_user ? 
                          current_user_and_favorite_tracks.html_safe : nil.to_json

    respond_to do |format|
      format.html
      format.json { render json: current_user }
    end
  end
end
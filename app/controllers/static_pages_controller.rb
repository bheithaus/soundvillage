class StaticPagesController < ApplicationController
  def sc_player
    
  end
  
  def app
    @radio_stations = RadioStation.includes(:tags).all
  end
end

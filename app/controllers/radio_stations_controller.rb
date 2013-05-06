class RadioStationsController < ApplicationController
  respond_to :json
  
  def index 
    @radio_stations = RadioStation.all
    
    render :json @radio_stations
  end
  
  
  
  def new
    
    
    
  end
  
  def create
    @radio_station = RadioStation.new(params[:radio_station])
    
    if @radio_station.save
      render json: @radio_station
    else
      p "aw crap"
    end
  end

end

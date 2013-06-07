class RadioStationsController < ApplicationController
  respond_to :json
  
  def index
    
    @radio_stations = RadioStation.all
    
    render json: @radio_stations
  end

  
  def create
    @radio_station = RadioStation.new(params[:radio_station])
    
    if @radio_station.save
      render json: @radio_station
    else
      render json: {}, status: 422
    end
  end
  
  def update
    @radio_station = RadioStation.find(params[:id])
    
    if @radio_station.update_attributes(params[:radio_station])
      render json: @radio_station
    else
      render json: {}, status: 422
    end
  end
end

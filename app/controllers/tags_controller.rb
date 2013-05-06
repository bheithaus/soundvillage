class TagsController < ApplicationController
  respond_to :json
  
  def create
    @radio_tag = RadioTag.new(params[:tag])
    
    if @radio_tag.save
      render json: @radio_tag
    else
      p "aw crap"
    end
  end
end

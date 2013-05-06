class TagsController < ApplicationController
  respond_to :json
  
  def index 
    @tags = Tag.all
    
    render json: @tags
  end
  
  def create
    @tag = Tag.new(params[:tag])
    
    if @tag.save
      render json: @tag
    else
      p "aw crap"
    end
  end
end

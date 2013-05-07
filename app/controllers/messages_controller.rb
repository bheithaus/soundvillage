require 'pusher'

class MessagesController < ApplicationController
  respond_to :json
  
  def create
    @message = Message.new(params[:message])  
    
    if @message.save
      
      Pusher['my-channel'].trigger('my-event', {:message => 'hello world'})
      
      render json: @message
    end
  end
end

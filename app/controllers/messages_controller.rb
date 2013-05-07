require 'pusher'

class MessagesController < ApplicationController
  respond_to :json
  
  def create
    @message = Message.new(params[:message])
    
    if @message.save
      render json: @message
      Pusher['my-channel'].trigger('my-event', {:message => 'hello world'})
    end
  end
end

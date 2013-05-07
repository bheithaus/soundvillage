require 'pusher'

class MessagesController < ApplicationController
  
  def create
    @message = Message.new(params[:message])
      Pusher['my-channel'].trigger('my-event', {:message => 'hello world'})
    end
end

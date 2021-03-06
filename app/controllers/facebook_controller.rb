class FacebookController < ApplicationController
  respond_to :json
  def post_to_wall
    return unless current_user
    current_user.post_to_fb(params[:wall_post])
    render json: { success: true }
  end  
end
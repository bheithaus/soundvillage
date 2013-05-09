class Favoriting < ActiveRecord::Base
  attr_accessible :user_id, :favorite_track_id
  
  belongs_to :user
  belongs_to :favorite_track
  
  # validates?
end

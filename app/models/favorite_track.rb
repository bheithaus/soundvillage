class FavoriteTrack < ActiveRecord::Base
  attr_accessible :artist, :title, :url
  
  has_many :favoritings, dependent: :destroy
  has_many :users, through: :favoritings, inverse_of: :favorite_tracks
end

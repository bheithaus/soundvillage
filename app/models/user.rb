class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :favorite_track_ids
  # attr_accessible :title, :body
  
  has_many :favoritings, dependent: :destroy
  has_many :favorite_tracks, through: :favoritings, inverse_of: :users
  
  accepts_nested_attributes_for :favorite_tracks
  # def as_json(options)
 #    #don't care about your options!
 #    super(:only => [:email], include: :favorite_track_ids)
 #  end
end

class RadioStation < ActiveRecord::Base
  
  has_many :radio_tags
  has_many :tags, through: :radio_tags
  # attr_accessible :title, :body
end

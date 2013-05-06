class Tag < ActiveRecord::Base
  attr_accessible :title, :body
  
  has_many :radio_tags
  
end

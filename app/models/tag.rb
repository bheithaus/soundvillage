class Tag < ActiveRecord::Base
  attr_accessible :name, :weight
  
  has_many :radio_tags
end

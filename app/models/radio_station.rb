class RadioStation < ActiveRecord::Base
  attr_accessible :name, :editable, :tags_attributes
  
  has_many :radio_tags
  has_many :tags, through: :radio_tags
  
  accepts_nested_attributes_for :tags
end

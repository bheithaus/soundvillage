class RadioTag < ActiveRecord::Base
  attr_accessible :name
  
  belongs_to :radio_station
  belongs_to :tag
  
  validates :name, presence: true
end

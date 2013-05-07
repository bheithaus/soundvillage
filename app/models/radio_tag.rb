class RadioTag < ActiveRecord::Base
  attr_accessible :radio_station_id, :tag_id
  
  belongs_to :radio_station
  belongs_to :tag
end

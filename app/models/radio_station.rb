class RadioStation < ActiveRecord::Base
  attr_accessible :name, :editable, :genre, :image_url, :tags_attributes
  
  has_many :radio_tags
  has_many :tags, through: :radio_tags
  
  accepts_nested_attributes_for :tags
  
  def as_json(options)
    # this example ignores the user's options
    super(:only => [:id, :name, :editable, :genre, :image_url], include: { tags: { except: [:created_at, :updated_at] } })
  end
end
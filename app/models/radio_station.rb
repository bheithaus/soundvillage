class RadioStation < ActiveRecord::Base
  attr_accessible :name, :editable, :genre, :tags_attributes
  
  has_many :radio_tags
  has_many :tags, through: :radio_tags
  
  accepts_nested_attributes_for :tags, reject_if: :tag_already_included?
  
  
  def as_json(options)
    # this example ignores the user's options
    super(:only => [:id, :name, :editable, :genre], include: :tags)
  end
  
  private
  
    def tag_already_included?(attribute)
      tags.any? { |tag| tag.name == attribute[:name] }
    end
end

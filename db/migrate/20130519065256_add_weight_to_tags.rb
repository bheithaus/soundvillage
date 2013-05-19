class AddWeightToTags < ActiveRecord::Migration
  def change
    add_column :tags, :weight, :integer
  end
end
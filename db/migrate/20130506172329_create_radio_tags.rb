class CreateRadioTags < ActiveRecord::Migration
  def change
    create_table :radio_tags do |t|
      t.integer :radio_id
      t.integer :tag_id
      
      t.timestamps
    end
    add_index :radio_tags, [:radio_id, :tag_id], unique: true
  end
end

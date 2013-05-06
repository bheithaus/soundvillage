class CreateRadioTags < ActiveRecord::Migration
  def change
    create_table :radio_tags do |t|

      t.timestamps
    end
  end
end

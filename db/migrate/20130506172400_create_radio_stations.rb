class CreateRadioStations < ActiveRecord::Migration
  def change
    create_table :radio_stations do |t|
      t.string :name
      
      t.boolean :editable
      t.timestamps
    end
  end
end

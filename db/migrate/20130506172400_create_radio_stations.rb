class CreateRadioStations < ActiveRecord::Migration
  def change
    create_table :radio_stations do |t|

      t.timestamps
    end
  end
end

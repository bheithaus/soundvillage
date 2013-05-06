class RenameColumnRadioStationId < ActiveRecord::Migration
  def up
    remove_column :radio_tags, :radio_id
    add_column :radio_tags, :radio_station_id, :integer
  end

  def down
  end
end

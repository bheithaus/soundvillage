class AddGenreToRadioStation < ActiveRecord::Migration
  def change
    add_column :radio_stations, :genre, :string
  end
end

class AddImageUrlToRadioStation < ActiveRecord::Migration
  def change
    add_column :radio_stations, :image_url, :string
  end
end

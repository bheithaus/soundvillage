class CreateFavoriteTracks < ActiveRecord::Migration
  def change
    create_table :favorite_tracks do |t|
      t.string :artist
      t.string :title
      t.string :url
      
      t.timestamps
    end
  end
end

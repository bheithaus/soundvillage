class CreateFavoritings < ActiveRecord::Migration
  def change
    create_table :favoritings do |t|
      t.integer :user_id
      t.integer :favorite_track_id

      t.timestamps
    end
  end
end

class DropColumnsFromUser < ActiveRecord::Migration
  def up
    remove_column :users, :provider, :uid, :name, :auth_token
  end

  def down
  end
end

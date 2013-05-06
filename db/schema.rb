# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130506202842) do

  create_table "radio_stations", :force => true do |t|
    t.string   "name"
    t.boolean  "editable"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "radio_tags", :force => true do |t|
    t.integer  "radio_id"
    t.integer  "tag_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "radio_tags", ["radio_id", "tag_id"], :name => "index_radio_tags_on_radio_id_and_tag_id", :unique => true

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end

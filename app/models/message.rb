class Message < ActiveRecord::Base
  attr_accessible :body, :sender_id, :sender_name
end

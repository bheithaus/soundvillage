module RedisHelper
  def reset_public_stations
    $redis.del("PublicStations")
  end
  
  def reset_redis_user_and_favorites(user = current_user)
    $redis.del(redis_user_key(user))
  end
  
  
  def public_stations
    if $redis.exists("PublicStations") 
      puts "loading RADIO STATIONS from Redis Instance"
      radio_stations = $redis.get("PublicStations")
    else
      puts "hitting SQL Database RADIO STATIONS"
      radio_stations = RadioStation.includes(:tags).all.to_json
      $redis.set("PublicStations", radio_stations)
    end
    
    radio_stations
  end
  
  def current_user_and_favorite_tracks
    if $redis.exists(redis_user_key(current_user))
      user_and_tracks = $redis.get(redis_user_key(current_user))
    else
      user_and_tracks = User.includes(:favorite_tracks)
                            .find_by_email(current_user.email)
                            .to_json(include: :favorite_tracks)
                            
      $redis.set(redis_user_key(current_user), user_and_tracks)
    end
    
    user_and_tracks
  end
  
  def redis_user_key(user)
    "user_#{user.id}"
  end
end

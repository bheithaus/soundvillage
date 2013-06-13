uri = URI.parse(ENV["REDISTOGO_URL"])
if Rails.env.production?
  $redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
else
  $redis = Redis.new
end
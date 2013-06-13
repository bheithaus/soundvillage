class User < ActiveRecord::Base
  include RedisHelper
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  devise :omniauthable, :omniauth_providers => [:facebook]
        
  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :favorite_track_ids
  
  # omniauth
  attr_accessible :provider, :uid, :name, :auth_token
  
  # attr_accessible :title, :body
  has_many :favoritings, dependent: :destroy
  has_many :favorite_tracks, through: :favoritings, inverse_of: :users
   
  def as_json(options)
    params = {only: [:id, :email, :provider]}
    params = params.merge(options)
    
    p params
  
    super(params)
  end
 
  def connect_with_facebook_oauth(auth)
      if self.update_attributes(provider: auth.provider,
                                     uid: auth.uid,
                              auth_token: auth.credentials.token)
        reset_redis_user_and_favorites(self)
        
        return { user: self, success: true }
      else
        return { user: self, success: false }
      end
  end
  
  def post_to_fb(wall_post)
     p wall_post
     p wall_post["station"]["url"]
     user = FbGraph::User.me(self.auth_token)
     url = Rails.env.production? ? wall_post["station"]["url"] : "http://soundvillage.herokuapp.com"
     
     user.feed!(
        message:
        "I'm listening to #{wall_post["track"]["title"]} by #{wall_post["track"]["artist"]} (#{wall_post["track"]["url"]}) on SoundVillage Radio!",
        link: url,
        name: "SoundVillage Internet Radio",
        description: 
        'SoundVillage Radio, powered by www.soundcloud.com,
        a great way to discover independent electronic music!'
      )
  end
end

Soundvillage::Application.routes.draw do  
  root to: "static_pages#app"
  
  devise_for :users,
                controllers: { omniauth_callbacks: "users/omniauth_callbacks",
                                    registrations: "registrations",
                                         sessions: "sessions" }

  post '/post_to_fb_wall' => 'facebook#post_to_wall'

  post '/pusher/auth' => 'pusher#auth'
  
  resources :messages
  resources :favorite_tracks
  resources :radio_stations
  resources :tags, only: [:index]
end
Soundvillage::Application.routes.draw do  
  root to: "static_pages#app"
  
  devise_for :users,
                controllers: { registrations: "registrations",
                                    sessions: "sessions" }
                                    
  post '/pusher/auth' => 'pusher#auth'
  
  resources :messages
  resources :favorite_tracks
  resources :radio_stations
  resources :tags, only: [:index]
end
Soundvillage::Application.routes.draw do
  devise_for :users,
                controllers: { registrations: "registrations",
                                    sessions: "sessions" }

  root to: "static_pages#app"


  post '/pusher/auth' => 'pusher#auth'
  
  resources :messages
  resources :favorite_tracks
  resources :radio_stations
  resources :tags, only: [:index]
end
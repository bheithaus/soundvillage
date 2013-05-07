Soundvillage::Application.routes.draw do
  root to: "static_pages#app"

  resources :messages
  resources :radio_stations
  resources :tags, only: [:index]
end
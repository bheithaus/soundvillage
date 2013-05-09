Soundvillage::Application.routes.draw do
  devise_for :users, :controllers => { :registrations => "registrations" }

  root to: "static_pages#app"

  resources :messages
  resources :favorite_tracks
  resources :radio_stations
  resources :tags, only: [:index]
end
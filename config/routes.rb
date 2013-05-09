Soundvillage::Application.routes.draw do
  devise_for :users

  root to: "static_pages#app"

  resources :messages
  resources :favorite_tracks
  resources :users do
    resources :favorite_tracks, only: [:create, :destroy]
  end
  resources :radio_stations
  resources :tags, only: [:index]
end
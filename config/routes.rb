Rails.application.routes.draw do
  default_url_options :host => "localhost:3002"
  namespace :api do
    namespace :v1 do
      # Users
      get '/users', to: 'users#index' do
        get :avatar, on: :member
      end
     get '/user/:id', to: 'users#show' do
        get :avatar, on: :member
      end
     
      post '/users/add', to: 'users#create'
      delete '/users/delete/:id', to: 'users#destroy'
      patch '/user/update/:id', to: 'users#update'
      post '/users/login', to: 'authentication#login'

      # Products
      get '/products', to: 'products#index' do
        get :image, on: :member
      end
      get '/products/:id', to: 'products#show' do
        get :image, on: :member
      end
     
      post '/products/add', to: 'products#create'
      delete '/products/delete/:id', to: 'products#destroy'
      patch '/products/update/:id', to: 'products#update'
      get '/products/category/:category', to: 'products#fetch_by_category'

      # Categories
      get '/categories', to: 'categories#index'
      get '/categories/:id', to: 'categories#show'
      post '/categories/add', to: 'categories#create'
      delete '/categories/delete/:id', to: 'categories#destroy'
      patch '/categories/update/:id', to: 'categories#update'

      # Suppliers
      get '/suppliers', to: 'suppliers#index'
      get '/suppliers/:id', to: 'suppliers#show'
      post '/suppliers/add', to: 'suppliers#create'
      delete '/suppliers/delete/:id', to: 'suppliers#destroy'
      patch '/suppliers/update/:id', to: 'suppliers#update'
    end
  end
end

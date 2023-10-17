class  Api::V1::AuthenticationController < ApplicationController
  before_action :authorize_request, except: :login
     def login 
       @user = User.find_by(login_required)
       if @user
        token = JsonWebToken.encode(user_id: @user.id)
        time = Time.now + 24.hours.to_i
        render json: { token:token, exp: time.strftime('%m-%d-%Y %H:%M'),
                       user: @user }, status: :ok
      else
        render json: @user.errors.full_messages, status: 500
      end
     end 

     private

     def login_required
         params.permit(:email, :password)
     end
end 
class Api::V1::UsersController < ApplicationController
  # before_action :authorize_request, except: :create
  def index
    @users = User.order('created_at desc').includes(:avatar_attachment)
    if @users
      render json: @users, status: :ok
    else
      render json: @users.errors.full_messages, status: :bad_request
    end
  end

  def show
  @user = User.find_by(id: params[:id])
  if @user
    render json: @user, serializer: UserSerializer, status: :ok
  else
    render json: 'No user was found', status: :not_found
  end
end


  def create
    @user = User.new(user_params)
    if @user.save
      token = JsonWebToken.encode(user_id: @user.id)
      time = Time.now + 24.hours.to_i
      render json: { token:token, exp: time.strftime('%m-%d-%Y %H:%M'),
                     user: @user }, status: :ok
    else
      render json: @user.errors.full_messages, status: 500
    end

  end

  def destroy
    @user = User.find_by_id(params[:id])
    if @user.destroy
      render json: 'user successfully deleted', status: 200
    else
      render json: 'unable to delete this user', status: unprocessable_entity
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
    render json: 'user updated successfully', status: 201
    else
      render json: 'failed to update user', status: unprocessable_entity
    end
  end

 private

 def user_params
  # params.require(:user).permit(:name, :email, :password)
  params.permit(:name, :email, :password,:phone_number, :role,:avatar)
end

end

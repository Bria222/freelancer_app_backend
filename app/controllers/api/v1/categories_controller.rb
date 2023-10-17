class Api::V1::CategoriesController < ApplicationController
  before_action :authorize_request, except: :index

  def index
    @categories = Category.includes(:products).all
    if @categories
      @categories = @categories.map do |category|
        {
         category: category.attributes, 
        products: category.products.map(&:attributes)
        }
      end
      render json: @categories, status: :ok
    else
      render json: { error: @categories.errors.full_messages }, status: :bad_request
    end
  end



  def show
    @category = Category.find_by(id: params[:id])
    if @category
      render json: @category, status: :ok
    else
      render json: { error: 'category not found' }, status: :not_found
    end
  end

  def create
    if current_user.admin? || current_user.supplier?
      @category = Category.new(category_params)
      if @category.save
        render json: @category, status: :created
      else
        render json: { errors: @category.errors.full_messages }, status: :bad_request
      end
    else 
      render json: { message: 'Unauthorized' }, status: :unauthorized
    end
  end

  def destroy
    @category = Category.find_by(id: params[:id])
    if @category
      @category.destroy
      render json: { message: 'category deleted successfully' }, status: :ok
    else
      render json: { error: 'category not found' }, status: :not_found
    end
  end

  def update
    @category = Category.find_by(id: params[:id])
    if @category
      if @category.update(category_params)
        render json: { message: 'category updated successfully' }, status: :ok
      else
        render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'category not found' }, status: :not_found
    end
  end

  

  private

  def category_params
    params.permit(:name)
   
    # params.require(:category).permit(:name)
  end
end

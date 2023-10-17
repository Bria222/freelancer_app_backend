class Api::V1::SuppliersController < ApplicationController
   before_action :authorize_request
  def index
    @suppliers = Supplier.includes(:user).all
    if @suppliers
      @suppliers = @suppliers.map do |supplier|
        {
          supplier_info: supplier.user,
          company_info: supplier
        }
      end
      render json: @suppliers, status: :ok
    else
      render json: @suppliers.errors.full_messages, status: :bad_request
    end
  end

  def show
    @supllier = Supplier.where(id: params[:id])
    if @supllier
      render json: @supllier, status: :ok
    else
      render json:'no supllier was found', status: 404
    end
  end

  def create
    p current_user.id
    @supplier = current_user.build_supplier(supplier_params)
    if @supplier.save
       @supplier = {
           supplier_info: current_user,
           company_info: @supplier
       }
      render json: @supplier, status: :ok
    else
      render json: @supplier.errors.full_messages, status: 500
    end
  end
  def destroy
    @supllier = Supplier.find_by_id(params[:id])
    if @supllier.destroy
      render json: 'supllier successfully deleted', status: 200
    else
      render json: 'unable to delete this supllier', status: unprocessable_entity
    end
  end

  def update
    @supllier = Supplier.find(params[:id])
    if @supllier.update(supplier_params)
    render json: 'supplier updated successfully', status: 201
    else
      render json: 'failed to update supplier', status: unprocessable_entity
    end
  end

 private

 def supplier_params
  # params.require(:user).permit(:name, :email, :password)
  params.permit(:company_name, :id_number, :address, :street)
end

end


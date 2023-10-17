class ProductSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :description, :price, :units, :category_id,:discount_percentage,:rating,:stock,:brand, :product_images

  def product_images
    object.product_images.map { |image| url_for(image) if image.blob.present? }
  end
end

class Product < ApplicationRecord
    has_many_attached :product_images
    belongs_to :category
end

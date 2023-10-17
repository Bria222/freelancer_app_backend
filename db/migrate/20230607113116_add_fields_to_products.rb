class AddFieldsToProducts < ActiveRecord::Migration[7.0]
  def change
    add_column :products, :discount_percentage, :float
    add_column :products, :rating, :float
    add_column :products, :stock, :integer
    add_column :products, :brand, :string
  end
end

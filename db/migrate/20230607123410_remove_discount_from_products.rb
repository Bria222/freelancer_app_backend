class RemoveDiscountFromProducts < ActiveRecord::Migration[7.0]
  def change
    remove_column :products, :discount
  end
end

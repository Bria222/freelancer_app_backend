class RemoveColumnProducts < ActiveRecord::Migration[7.0]
  def change
    remove_column :products, :images
  end
end

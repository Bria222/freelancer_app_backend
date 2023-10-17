class RenameColumnProducts < ActiveRecord::Migration[7.0]
  def change
    rename_column :products, :image, :images
  end
end

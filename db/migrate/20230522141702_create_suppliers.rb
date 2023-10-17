class CreateSuppliers < ActiveRecord::Migration[7.0]
  def change
    create_table :suppliers do |t|
      t.string :company_name
      t.bigint :id_number
      t.string :address
      t.string :street
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end

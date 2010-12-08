class CreateVendors < ActiveRecord::Migration
  def self.up
    create_table :vendors do |t|
      t.string :city_state
      t.text :items
      t.float :lat
      t.float :lng
      t.text :notes
      t.string :street
      t.string :vendor

      t.timestamps
    end
  end

  def self.down
    drop_table :vendors
  end
end

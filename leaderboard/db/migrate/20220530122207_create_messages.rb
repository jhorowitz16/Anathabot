class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.text :username
      t.text :date
      t.text :text

      t.timestamps
    end
  end
end

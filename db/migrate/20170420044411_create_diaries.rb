class CreateDiaries < ActiveRecord::Migration
  def change
    create_table :diaries do |t|
      t.string :title
      t.integer :date
      t.string :content

      t.timestamps null: false
    end
  end
end

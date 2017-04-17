class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.string :title
      t.string :diary

      t.timestamps null: false
    end
  end
end

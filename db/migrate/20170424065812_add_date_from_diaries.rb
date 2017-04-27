class AddDateFromDiaries < ActiveRecord::Migration
  def change
    add_column :diaries, :date, :string
  end
end

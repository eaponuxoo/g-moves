class RemoveDateFromDiaries < ActiveRecord::Migration
  def change
    remove_column :diaries, :date, :integer
  end
end

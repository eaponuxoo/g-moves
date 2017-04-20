class User < ActiveRecord::Base
  has_many :diaries, dependent: :destroy
end

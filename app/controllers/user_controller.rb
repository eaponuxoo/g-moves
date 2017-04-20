class UserController < ApplicationController
  def show
    # ほんとは下のところをparams[:id]にする
    @user = User.find(1)
    @is_checking_user_log = true
  end
end

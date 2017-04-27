class DiariesController < ApplicationController
  before_action :set_diary, only: [:edit, :update, :destroy]

  # GET /diaries
  # GET /diaries.json
  def index
    @diaries = Diary.all
  end
  # GET /diaries/1
  # GET /diaries/1.json

  def check
    if Diary.find_by(params[:day]).present?
      redirect_to action: 'show', day: params[:day]
    else
      redirect_to action: 'new', day: params[:day]
    end
  end

  def show
    @diary = Diary.find_by(params[:day])
  end
  # GET /diaries/new
  def new
    @diary = Diary.new
    @diary.date = params[:day]
  end

  # GET /diaries/1/edit
  def edit
  end

  # POST /diaries
  # POST /diaries.json
  def create
    @diary = Diary.new(diary_params)
    redirect_to action: 'show', day: params[:date]
  end

  # PATCH/PUT /diaries/1
  # PATCH/PUT /diaries/1.json
  def update
    respond_to do |format|
      if @diary.update(diary_params)
        format.html { redirect_to @diary, notice: 'Diary was successfully updated.' }
        format.json { render :show, status: :ok, location: @diary }
      else
        format.html { render :edit }
        format.json { render json: @diary.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /diaries/1
  # DELETE /diaries/1.json
  def destroy
    @diary.destroy
    respond_to do |format|
      format.html { redirect_to diaries_url, notice: 'Diary was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_diary
      @diary = Diary.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def diary_params
      params.require(:diary).permit(:title, :date, :content, :user_id)
    end
end

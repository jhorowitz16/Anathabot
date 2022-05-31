class UsersController < ApplicationController
  def new
    puts params
    Message.new(username: params[:username], date: params["date"], text: params[:text]).save
  end

  def show
    @username = params[:id]
    @messages = Message.where(username: @username)
    @day_count = _count_unique_days
    @message_count = @messages.size

    @json = JSON.generate({ username: @username, day_count: @day_count, message_count: @message_count })
    render json: @json
  end

  def _count_unique_days
    s = Set[]
    for message in @messages do
      s.add(message.date)
    end
    s.size
  end
end

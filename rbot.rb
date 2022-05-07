TWITCH_CHAT_TOKEN = ENV['TWITCH_CHAT_TOKEN']
TWITCH_USER       = ENV['TWITCH_USER']

gem 'twitch/chat'
require 'twitch/chat'

client = Twitch::Chat::Client.new(channel: 'anathana', nickname: TWITCH_USER, password: TWITCH_CHAT_TOKEN) do
  on(:connected) do
    send_message 'Hi guys!'
  end

  on(:subscribe) do |user|
    client.send_message "Hi #{user}, thank you for subscription"
  end

  on(:slow_mode) do
    send_message "Slow down guys"
  end

  on(:subscribers_mode_off) do
    send_message "FREEEEEDOOOOOM"
  end

  on(:message) do |user, message|
    send_message "Current time: #{Time.now.utc}" if message == '!time'
  end

  on(:message) do |user, message|
    send_mesage "Hi #{user}!" if message.include?("Hi #{nickname}")
  end

  on(:message) do |user, message|
    send_message channel.moderators.join(', ') if message == '!moderators'
  end

  on(:new_moderator) do |user|
    send_message "#{user} is our new moderator"
  end

  on(:remove_moderator) do |user|
    send_message "#{user} is no longer moderator"
  end

  on(:disconnect) do
    send_message 'Bye guys!'
  end
end

client.run!
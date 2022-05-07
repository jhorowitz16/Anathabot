require 'uri'
require 'net/http'
require 'json'

ANATHANA_ACCOUNT_ID = 'A-buldZ0gSitz6AgtD0Gso6NrspGeQ0Oylry-jSydTvb5u0'
ANATHANA_PUUID = 'BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw'
$key = File.open("key.txt").read
puts $key

$augment_hash = Hash.new(0)

def get_recent_games(count)
  url = "https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/#{ANATHANA_PUUID}/ids?count=#{count}&api_key=#{$key}"
  res = Net::HTTP.get_response(URI(url))
  puts res.body if res.is_a?(Net::HTTPSuccess)
  res.body = res.body[1..-2].tr('"', '')
  res.body.split(",")
end

def get_match_data(match_id)
  url = "https://americas.api.riotgames.com/tft/match/v1/matches/#{match_id}?api_key=#{$key}"
  puts url
  res = Net::HTTP.get_response(URI(url))
  data = JSON.parse(res.body)
  partcipants = data["info"]["participants"]
  anathana_data = partcipants.find {|p| (p["puuid"] == ANATHANA_PUUID)}
  puts anathana_data
  anathana_data
end

def update_augments(augments)
  augments.each {|augment| $augment_hash[augment] += 1}
end

def fetch_and_process(match_id)
  anathana_data = get_match_data(match_id)
  update_augments(anathana_data["augments"])
end


games = get_recent_games(3)
puts games.length
games.each { |match_id| fetch_and_process(match_id) }

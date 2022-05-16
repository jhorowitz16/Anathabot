require 'uri'
require 'net/http'
require 'json'

ANATHANA_ACCOUNT_ID = 'A-buldZ0gSitz6AgtD0Gso6NrspGeQ0Oylry-jSydTvb5u0'
ANATHANA_PUUID = 'BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw'
$key = File.open("key.txt").read
puts $key

$augment_hash = Hash.new(0)
$items_hash = Hash.new(0)

def get_recent_games(count)
  url = "https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/#{ANATHANA_PUUID}/ids?count=#{count}&api_key=#{$key}"
  res = Net::HTTP.get_response(URI(url))
  unless res.is_a?(Net::HTTPSuccess)
    puts "Refresh key at https://developer.riotgames.com/"
    return
  end
  res.body = res.body[1..-2].tr('"', '')
  res.body.split(",")
end

def get_match_data(match_id)
  url = "https://americas.api.riotgames.com/tft/match/v1/matches/#{match_id}?api_key=#{$key}"
  res = Net::HTTP.get_response(URI(url))
  data = JSON.parse(res.body)
  partcipants = data["info"]["participants"]
  anathana_data = partcipants.find { |p| (p["puuid"] == ANATHANA_PUUID) }
  puts anathana_data
  anathana_data
end

def removed_digits(s)
  s.tr('0-9', '')
end

def update_augments(augments)
  augments.each { |augment| $augment_hash[removed_digits(augment)] += 1 }
end

def update_items(units)
  units.each do |unit|
    items = unit["itemNames"]
    items.each { |item| $items_hash[item] += 1}
  end

end


def fetch_and_process(match_id)
  begin
    anathana_data = get_match_data(match_id)
    update_augments(anathana_data["augments"])
    update_items(anathana_data["units"])
  rescue
    puts "error with #{match_id}"
  end
end

def build_insights(filepath, hash)
  result = hash.sort_by do |k, v|
    -v
  end
  insights = result.map { |r| "#{r[0].split('_')[2]} (#{r[1]})" }[0..4].join(", ")
  puts insights
  File.open(filepath, "w") { |f| f.write "#{insights}" }
end

games = get_recent_games(20)
games.each { |match_id| fetch_and_process(match_id) }

build_insights("augments.txt", $augment_hash)
build_insights("items.txt", $items_hash)

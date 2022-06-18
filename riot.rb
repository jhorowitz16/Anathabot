require 'uri'
require 'net/http'
require 'json'
GAME_COUNT = 69

MIN_REQUIRED_SIZE_TO_SCORE = 5
ANATHANA_ACCOUNT_ID = 'A-buldZ0gSitz6AgtD0Gso6NrspGeQ0Oylry-jSydTvb5u0'
WHITEFOX_PUUID = 'EPd_f6AMZ728QGVU5EMOwYj2gShvkH_b37636HCto0mmS1JSIo2S9IeHgrOTVY242mVVCy2JNHFoew'
ANATHANA_PUUID = 'BpOSYHAsoed8SA3fOZU4Zv8M6duicGkcaX9gv8oCl4zFRXVFRjGnkrXVa1HflspFi3NKOhB1g8pDgw'
VANILLAXD_PUUID = '2g8nI_5dfNrMOAe68UQMSBKVdU3VdtTR2QNwQXqCWTIA-dkYXj2DcBR-PzQnQpGBxODAjgpeN--3VA'
SAPPHERICAL_PUUID = 'KrZNxB90-zGOmYDtu3TWVu1rJqIxrpjj3dHQdujb_c98kP3fRHtE6Eyp-XrtnEh4MIxF-CTuglcUCA'
PUUID = ANATHANA_PUUID
$key = File.open("key.txt").read
puts $key

$augment_hash = Hash.new(0)
$items_hash = Hash.new(0)
$augment_placement_hash = Hash.new([])
$component_count_list = []
$round_list = []

def get_recent_games(count)
  url = "https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/#{PUUID}/ids?count=#{count}&api_key=#{$key}"
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
  anathana_data = partcipants.find { |p| (p["puuid"] == PUUID) }
  puts anathana_data
  anathana_data
end

def removed_digits(s)
  s.tr('0-9', '')
end

def update_augments(augments, placement)
  augments.each { |augment| $augment_hash[removed_digits(augment)] += 1 }
  augments.each { |augment| $augment_placement_hash[removed_digits(augment)] += [placement] }
end

def update_units(units)
  component_count = 0
  units.each do |unit|
    items = unit["itemNames"]
    items.each { |item| $items_hash[item] += 1 }
    item_ids = unit["items"]
    item_ids.each { |item| component_count += (item <= 9 ? 1 : 2) }
  end
  $component_count_list.append(component_count)
end

def fetch_and_process(match_id)
  begin
    anathana_data = get_match_data(match_id)
    update_augments(anathana_data["augments"], anathana_data["placement"])
    update_units(anathana_data["units"])
    $round_list.append(anathana_data["last_round"])
  rescue
    puts "error with #{match_id}"
  end
end

def build_hash_insights(filepath, hash)
  result = hash.sort_by do |k, v|
    -v
  end
  insights = result.map { |r| "#{r[0].split('_')[2]} (#{r[1]})" }[0..4].join(", ")
  puts insights
  File.open(filepath, "w") { |f| f.write "#{GAME_COUNT}\n#{insights}" }
end

def _compute_stats(frequency_list)
  mean = frequency_list.sum(0.0) / frequency_list.size
  sum = frequency_list.sum(0.0) { |element| (element - mean) ** 2 }
  # standard_deviation = Math.sqrt(sum / (frequency_list.size - 1))
  [mean.round(2)]
end

def build_component_insights(filepath, frequency_list, round_list)
  items_per_round = frequency_list.zip(round_list).map { |tup| tup[0].to_f / tup[1] }
  insights = "#{_compute_stats(frequency_list).join(", ")}\n#{_compute_stats(items_per_round).join(", ")}"
  File.open(filepath, "w") { |f| f.write "#{insights}" }
end

def build_placement_insights(filepath, hash)
  puts $augment_placement_hash
  result = hash.sort_by do |k, v|
    stats = _compute_stats(v)
    mean = stats[0]
    standard_deviation = stats[1]
    (v.size < MIN_REQUIRED_SIZE_TO_SCORE) ? 9 : mean
  end
  insights = result.map { |r| "#{r[0].split('_')[2]} (#{r[1]}) mean: #{_compute_stats(r[1]).join('/')}" }.join("\n   ")
  puts insights
  File.open(filepath, "w") { |f| f.write "#{insights}" }
end

games = get_recent_games(GAME_COUNT)
games.each { |match_id| fetch_and_process(match_id) }

build_hash_insights("augments.txt", $augment_hash)
build_hash_insights("items.txt", $items_hash)
build_component_insights("components.txt", $component_count_list, $round_list)
build_placement_insights("placements.txt", $augment_placement_hash)

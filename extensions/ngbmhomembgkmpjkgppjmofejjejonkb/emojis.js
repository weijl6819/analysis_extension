var emojis = [
  { name: "a", element: undefined },
  { name: "ab", element: undefined },
  { name: "abc", element: undefined },
  { name: "abcd", element: undefined },
  { name: "accept", element: undefined },
  { name: "aerial_tramway", element: undefined },
  { name: "airplane", element: undefined },
  { name: "alarm_clock", element: undefined },
  { name: "alien", element: undefined },
  { name: "ambulance", element: undefined },
  { name: "anchor", element: undefined },
  { name: "angel", element: undefined },
  { name: "anger", element: undefined },
  { name: "angry", element: undefined },
  { name: "anguished", element: undefined },
  { name: "ant", element: undefined },
  { name: "apple", element: undefined },
  { name: "aquarius", element: undefined },
  { name: "aries", element: undefined },
  { name: "arrow_backward", element: undefined },
  { name: "arrow_double_down", element: undefined },
  { name: "arrow_double_up", element: undefined },
  { name: "arrow_down", element: undefined },
  { name: "arrow_down_small", element: undefined },
  { name: "arrow_forward", element: undefined },
  { name: "arrow_heading_down", element: undefined },
  { name: "arrow_heading_up", element: undefined },
  { name: "arrow_left", element: undefined },
  { name: "arrow_lower_left", element: undefined },
  { name: "arrow_lower_right", element: undefined },
  { name: "arrow_right", element: undefined },
  { name: "arrow_right_hook", element: undefined },
  { name: "arrow_up", element: undefined },
  { name: "arrow_up_down", element: undefined },
  { name: "arrow_up_small", element: undefined },
  { name: "arrow_upper_left", element: undefined },
  { name: "arrow_upper_right", element: undefined },
  { name: "arrows_clockwise", element: undefined },
  { name: "arrows_counterclockwise", element: undefined },
  { name: "art", element: undefined },
  { name: "articulated_lorry", element: undefined },
  { name: "astonished", element: undefined },
  { name: "athletic_shoe", element: undefined },
  { name: "atm", element: undefined },
  { name: "b", element: undefined },
  { name: "baby", element: undefined },
  { name: "baby_bottle", element: undefined },
  { name: "baby_chick", element: undefined },
  { name: "baby_symbol", element: undefined },
  { name: "back", element: undefined },
  { name: "baggage_claim", element: undefined },
  { name: "balloon", element: undefined },
  { name: "ballot_box_with_check", element: undefined },
  { name: "bamboo", element: undefined },
  { name: "banana", element: undefined },
  { name: "bangbang", element: undefined },
  { name: "bank", element: undefined },
  { name: "bar_chart", element: undefined },
  { name: "barber", element: undefined },
  { name: "baseball", element: undefined },
  { name: "basketball", element: undefined },
  { name: "bath", element: undefined },
  { name: "bathtub", element: undefined },
  { name: "battery", element: undefined },
  { name: "bear", element: undefined },
  { name: "bee", element: undefined },
  { name: "beer", element: undefined },
  { name: "beers", element: undefined },
  { name: "beetle", element: undefined },
  { name: "beginner", element: undefined },
  { name: "bell", element: undefined },
  { name: "bento", element: undefined },
  { name: "bicyclist", element: undefined },
  { name: "bike", element: undefined },
  { name: "bikini", element: undefined },
  { name: "bird", element: undefined },
  { name: "birthday", element: undefined },
  { name: "black_circle", element: undefined },
  { name: "black_joker", element: undefined },
  { name: "black_large_square", element: undefined },
  { name: "black_medium_small_square", element: undefined },
  { name: "black_medium_square", element: undefined },
  { name: "black_nib", element: undefined },
  { name: "black_small_square", element: undefined },
  { name: "black_square_button", element: undefined },
  { name: "blossom", element: undefined },
  { name: "blowfish", element: undefined },
  { name: "blue_book", element: undefined },
  { name: "blue_car", element: undefined },
  { name: "blue_heart", element: undefined },
  { name: "blush", element: undefined },
  { name: "boar", element: undefined },
  { name: "boat", element: undefined },
  { name: "bomb", element: undefined },
  { name: "book", element: undefined },
  { name: "bookmark", element: undefined },
  { name: "bookmark_tabs", element: undefined },
  { name: "books", element: undefined },
  { name: "boom", element: undefined },
  { name: "boot", element: undefined },
  { name: "bouquet", element: undefined },
  { name: "bow", element: undefined },
  { name: "bowling", element: undefined },
  { name: "bowtie", element: undefined },
  { name: "boy", element: undefined },
  { name: "bread", element: undefined },
  { name: "bride_with_veil", element: undefined },
  { name: "bridge_at_night", element: undefined },
  { name: "briefcase", element: undefined },
  { name: "broken_heart", element: undefined },
  { name: "bug", element: undefined },
  { name: "bulb", element: undefined },
  { name: "bullettrain_front", element: undefined },
  { name: "bullettrain_side", element: undefined },
  { name: "bus", element: undefined },
  { name: "busstop", element: undefined },
  { name: "bust_in_silhouette", element: undefined },
  { name: "busts_in_silhouette", element: undefined },
  { name: "cactus", element: undefined },
  { name: "cake", element: undefined },
  { name: "calendar", element: undefined },
  { name: "calling", element: undefined },
  { name: "camel", element: undefined },
  { name: "camera", element: undefined },
  { name: "cancer", element: undefined },
  { name: "candy", element: undefined },
  { name: "capital_abcd", element: undefined },
  { name: "capricorn", element: undefined },
  { name: "car", element: undefined },
  { name: "card_index", element: undefined },
  { name: "carousel_horse", element: undefined },
  { name: "cat", element: undefined },
  { name: "cat2", element: undefined },
  { name: "cd", element: undefined },
  { name: "chart", element: undefined },
  { name: "chart_with_downwards_trend", element: undefined },
  { name: "chart_with_upwards_trend", element: undefined },
  { name: "checkered_flag", element: undefined },
  { name: "cherries", element: undefined },
  { name: "cherry_blossom", element: undefined },
  { name: "chestnut", element: undefined },
  { name: "chicken", element: undefined },
  { name: "children_crossing", element: undefined },
  { name: "chocolate_bar", element: undefined },
  { name: "christmas_tree", element: undefined },
  { name: "church", element: undefined },
  { name: "cinema", element: undefined },
  { name: "circus_tent", element: undefined },
  { name: "city_sunrise", element: undefined },
  { name: "city_sunset", element: undefined },
  { name: "cl", element: undefined },
  { name: "clap", element: undefined },
  { name: "clapper", element: undefined },
  { name: "clipboard", element: undefined },
  { name: "clock1", element: undefined },
  { name: "clock10", element: undefined },
  { name: "clock1030", element: undefined },
  { name: "clock11", element: undefined },
  { name: "clock1130", element: undefined },
  { name: "clock12", element: undefined },
  { name: "clock1230", element: undefined },
  { name: "clock130", element: undefined },
  { name: "clock2", element: undefined },
  { name: "clock230", element: undefined },
  { name: "clock3", element: undefined },
  { name: "clock330", element: undefined },
  { name: "clock4", element: undefined },
  { name: "clock430", element: undefined },
  { name: "clock5", element: undefined },
  { name: "clock530", element: undefined },
  { name: "clock6", element: undefined },
  { name: "clock630", element: undefined },
  { name: "clock7", element: undefined },
  { name: "clock730", element: undefined },
  { name: "clock8", element: undefined },
  { name: "clock830", element: undefined },
  { name: "clock9", element: undefined },
  { name: "clock930", element: undefined },
  { name: "closed_book", element: undefined },
  { name: "closed_lock_with_key", element: undefined },
  { name: "closed_umbrella", element: undefined },
  { name: "cloud", element: undefined },
  { name: "clubs", element: undefined },
  { name: "cn", element: undefined },
  { name: "cocktail", element: undefined },
  { name: "coffee", element: undefined },
  { name: "cold_sweat", element: undefined },
  { name: "collision", element: undefined },
  { name: "computer", element: undefined },
  { name: "confetti_ball", element: undefined },
  { name: "confounded", element: undefined },
  { name: "confused", element: undefined },
  { name: "congratulations", element: undefined },
  { name: "construction", element: undefined },
  { name: "construction_worker", element: undefined },
  { name: "convenience_store", element: undefined },
  { name: "cookie", element: undefined },
  { name: "cool", element: undefined },
  { name: "cop", element: undefined },
  { name: "copyright", element: undefined },
  { name: "corn", element: undefined },
  { name: "couple", element: undefined },
  { name: "couple_with_heart", element: undefined },
  { name: "couplekiss", element: undefined },
  { name: "cow", element: undefined },
  { name: "cow2", element: undefined },
  { name: "credit_card", element: undefined },
  { name: "crescent_moon", element: undefined },
  { name: "crocodile", element: undefined },
  { name: "crossed_flags", element: undefined },
  { name: "crown", element: undefined },
  { name: "cry", element: undefined },
  { name: "crying_cat_face", element: undefined },
  { name: "crystal_ball", element: undefined },
  { name: "cupid", element: undefined },
  { name: "curly_loop", element: undefined },
  { name: "currency_exchange", element: undefined },
  { name: "curry", element: undefined },
  { name: "custard", element: undefined },
  { name: "customs", element: undefined },
  { name: "cyclone", element: undefined },
  { name: "dancer", element: undefined },
  { name: "dancers", element: undefined },
  { name: "dango", element: undefined },
  { name: "dart", element: undefined },
  { name: "dash", element: undefined },
  { name: "date", element: undefined },
  { name: "de", element: undefined },
  { name: "deciduous_tree", element: undefined },
  { name: "department_store", element: undefined },
  { name: "diamond_shape_with_a_dot_inside", element: undefined },
  { name: "diamonds", element: undefined },
  { name: "disappointed", element: undefined },
  { name: "disappointed_relieved", element: undefined },
  { name: "dizzy", element: undefined },
  { name: "dizzy_face", element: undefined },
  { name: "do_not_litter", element: undefined },
  { name: "dog", element: undefined },
  { name: "dog2", element: undefined },
  { name: "dollar", element: undefined },
  { name: "dolls", element: undefined },
  { name: "dolphin", element: undefined },
  { name: "door", element: undefined },
  { name: "doughnut", element: undefined },
  { name: "dragon", element: undefined },
  { name: "dragon_face", element: undefined },
  { name: "dress", element: undefined },
  { name: "dromedary_camel", element: undefined },
  { name: "droplet", element: undefined },
  { name: "dvd", element: undefined },
  { name: "e-mail", element: undefined },
  { name: "ear", element: undefined },
  { name: "ear_of_rice", element: undefined },
  { name: "earth_africa", element: undefined },
  { name: "earth_americas", element: undefined },
  { name: "earth_asia", element: undefined },
  { name: "egg", element: undefined },
  { name: "eggplant", element: undefined },
  { name: "eight", element: undefined },
  { name: "eight_pointed_black_star", element: undefined },
  { name: "eight_spoked_asterisk", element: undefined },
  { name: "eightball", element: undefined },
  { name: "electric_plug", element: undefined },
  { name: "elephant", element: undefined },
  { name: "email", element: undefined },
  { name: "end", element: undefined },
  { name: "envelope", element: undefined },
  { name: "envelope_with_arrow", element: undefined },
  { name: "es", element: undefined },
  { name: "euro", element: undefined },
  { name: "european_castle", element: undefined },
  { name: "european_post_office", element: undefined },
  { name: "evergreen_tree", element: undefined },
  { name: "exclamation", element: undefined },
  { name: "expressionless", element: undefined },
  { name: "eyeglasses", element: undefined },
  { name: "eyes", element: undefined },
  { name: "facepunch", element: undefined },
  { name: "factory", element: undefined },
  { name: "fallen_leaf", element: undefined },
  { name: "family", element: undefined },
  { name: "fast_forward", element: undefined },
  { name: "fax", element: undefined },
  { name: "fearful", element: undefined },
  { name: "feelsgood", element: undefined },
  { name: "feet", element: undefined },
  { name: "ferris_wheel", element: undefined },
  { name: "file_folder", element: undefined },
  { name: "finnadie", element: undefined },
  { name: "fire", element: undefined },
  { name: "fire_engine", element: undefined },
  { name: "fireworks", element: undefined },
  { name: "first_quarter_moon", element: undefined },
  { name: "first_quarter_moon_with_face", element: undefined },
  { name: "fish", element: undefined },
  { name: "fish_cake", element: undefined },
  { name: "fishing_pole_and_fish", element: undefined },
  { name: "fist", element: undefined },
  { name: "five", element: undefined },
  { name: "flags", element: undefined },
  { name: "flashlight", element: undefined },
  { name: "floppy_disk", element: undefined },
  { name: "flower_playing_cards", element: undefined },
  { name: "flushed", element: undefined },
  { name: "foggy", element: undefined },
  { name: "football", element: undefined },
  { name: "footprints", element: undefined },
  { name: "fork_and_knife", element: undefined },
  { name: "fountain", element: undefined },
  { name: "four", element: undefined },
  { name: "four_leaf_clover", element: undefined },
  { name: "fr", element: undefined },
  { name: "free", element: undefined },
  { name: "fried_shrimp", element: undefined },
  { name: "fries", element: undefined },
  { name: "frog", element: undefined },
  { name: "frowning", element: undefined },
  { name: "fu", element: undefined },
  { name: "fuelpump", element: undefined },
  { name: "full_moon", element: undefined },
  { name: "full_moon_with_face", element: undefined },
  { name: "game_die", element: undefined },
  { name: "gb", element: undefined },
  { name: "gem", element: undefined },
  { name: "gemini", element: undefined },
  { name: "ghost", element: undefined },
  { name: "gift", element: undefined },
  { name: "gift_heart", element: undefined },
  { name: "girl", element: undefined },
  { name: "globe_with_meridians", element: undefined },
  { name: "goat", element: undefined },
  { name: "goberserk", element: undefined },
  { name: "godmode", element: undefined },
  { name: "golf", element: undefined },
  { name: "grapes", element: undefined },
  { name: "green_apple", element: undefined },
  { name: "green_book", element: undefined },
  { name: "green_heart", element: undefined },
  { name: "grey_exclamation", element: undefined },
  { name: "grey_question", element: undefined },
  { name: "grimacing", element: undefined },
  { name: "grin", element: undefined },
  { name: "grinning", element: undefined },
  { name: "guardsman", element: undefined },
  { name: "guitar", element: undefined },
  { name: "gun", element: undefined },
  { name: "haircut", element: undefined },
  { name: "hamburger", element: undefined },
  { name: "hammer", element: undefined },
  { name: "hamster", element: undefined },
  { name: "hand", element: undefined },
  { name: "handbag", element: undefined },
  { name: "hankey", element: undefined },
  { name: "hash", element: undefined },
  { name: "hatched_chick", element: undefined },
  { name: "hatching_chick", element: undefined },
  { name: "headphones", element: undefined },
  { name: "hear_no_evil", element: undefined },
  { name: "heart", element: undefined },
  { name: "heart_decoration", element: undefined },
  { name: "heart_eyes", element: undefined },
  { name: "heart_eyes_cat", element: undefined },
  { name: "heartbeat", element: undefined },
  { name: "heartpulse", element: undefined },
  { name: "hearts", element: undefined },
  { name: "heavy_check_mark", element: undefined },
  { name: "heavy_division_sign", element: undefined },
  { name: "heavy_dollar_sign", element: undefined },
  { name: "heavy_exclamation_mark", element: undefined },
  { name: "heavy_minus_sign", element: undefined },
  { name: "heavy_multiplication_x", element: undefined },
  { name: "heavy_plus_sign", element: undefined },
  { name: "helicopter", element: undefined },
  { name: "herb", element: undefined },
  { name: "hibiscus", element: undefined },
  { name: "high_brightness", element: undefined },
  { name: "high_heel", element: undefined },
  { name: "hocho", element: undefined },
  { name: "honey_pot", element: undefined },
  { name: "honeybee", element: undefined },
  { name: "horse", element: undefined },
  { name: "horse_racing", element: undefined },
  { name: "hospital", element: undefined },
  { name: "hotel", element: undefined },
  { name: "hotsprings", element: undefined },
  { name: "hourglass", element: undefined },
  { name: "hourglass_flowing_sand", element: undefined },
  { name: "house", element: undefined },
  { name: "house_with_garden", element: undefined },
  { name: "hurtrealbad", element: undefined },
  { name: "hushed", element: undefined },
  { name: "ice_cream", element: undefined },
  { name: "icecream", element: undefined },
  { name: "id", element: undefined },
  { name: "ideograph_advantage", element: undefined },
  { name: "imp", element: undefined },
  { name: "inbox_tray", element: undefined },
  { name: "incoming_envelope", element: undefined },
  { name: "information_desk_person", element: undefined },
  { name: "information_source", element: undefined },
  { name: "innocent", element: undefined },
  { name: "interrobang", element: undefined },
  { name: "iphone", element: undefined },
  { name: "it", element: undefined },
  { name: "izakaya_lantern", element: undefined },
  { name: "jack_o_lantern", element: undefined },
  { name: "japan", element: undefined },
  { name: "japanese_castle", element: undefined },
  { name: "japanese_goblin", element: undefined },
  { name: "japanese_ogre", element: undefined },
  { name: "jeans", element: undefined },
  { name: "joy", element: undefined },
  { name: "joy_cat", element: undefined },
  { name: "jp", element: undefined },
  { name: "key", element: undefined },
  { name: "keycap_ten", element: undefined },
  { name: "kimono", element: undefined },
  { name: "kiss", element: undefined },
  { name: "kissing", element: undefined },
  { name: "kissing_cat", element: undefined },
  { name: "kissing_closed_eyes", element: undefined },
  { name: "kissing_heart", element: undefined },
  { name: "kissing_smiling_eyes", element: undefined },
  { name: "koala", element: undefined },
  { name: "koko", element: undefined },
  { name: "kr", element: undefined },
  { name: "lantern", element: undefined },
  { name: "large_blue_circle", element: undefined },
  { name: "large_blue_diamond", element: undefined },
  { name: "large_orange_diamond", element: undefined },
  { name: "last_quarter_moon", element: undefined },
  { name: "last_quarter_moon_with_face", element: undefined },
  { name: "laughing", element: undefined },
  { name: "leaves", element: undefined },
  { name: "ledger", element: undefined },
  { name: "left_luggage", element: undefined },
  { name: "left_right_arrow", element: undefined },
  { name: "leftwards_arrow_with_hook", element: undefined },
  { name: "lemon", element: undefined },
  { name: "leo", element: undefined },
  { name: "leopard", element: undefined },
  { name: "libra", element: undefined },
  { name: "light_rail", element: undefined },
  { name: "link", element: undefined },
  { name: "lips", element: undefined },
  { name: "lipstick", element: undefined },
  { name: "lock", element: undefined },
  { name: "lock_with_ink_pen", element: undefined },
  { name: "lollipop", element: undefined },
  { name: "loop", element: undefined },
  { name: "loudspeaker", element: undefined },
  { name: "love_hotel", element: undefined },
  { name: "love_letter", element: undefined },
  { name: "low_brightness", element: undefined },
  { name: "m", element: undefined },
  { name: "mag", element: undefined },
  { name: "mag_right", element: undefined },
  { name: "mahjong", element: undefined },
  { name: "mailbox", element: undefined },
  { name: "mailbox_closed", element: undefined },
  { name: "mailbox_with_mail", element: undefined },
  { name: "mailbox_with_no_mail", element: undefined },
  { name: "man", element: undefined },
  { name: "man_with_gua_pi_mao", element: undefined },
  { name: "man_with_turban", element: undefined },
  { name: "mans_shoe", element: undefined },
  { name: "maple_leaf", element: undefined },
  { name: "mask", element: undefined },
  { name: "massage", element: undefined },
  { name: "meat_on_bone", element: undefined },
  { name: "mega", element: undefined },
  { name: "melon", element: undefined },
  { name: "memo", element: undefined },
  { name: "mens", element: undefined },
  { name: "metal", element: undefined },
  { name: "metro", element: undefined },
  { name: "microphone", element: undefined },
  { name: "microscope", element: undefined },
  { name: "milky_way", element: undefined },
  { name: "minibus", element: undefined },
  { name: "minidisc", element: undefined },
  { name: "minusone", element: undefined },
  { name: "mobile_phone_off", element: undefined },
  { name: "money_with_wings", element: undefined },
  { name: "moneybag", element: undefined },
  { name: "monkey", element: undefined },
  { name: "monkey_face", element: undefined },
  { name: "monorail", element: undefined },
  { name: "moon", element: undefined },
  { name: "mortar_board", element: undefined },
  { name: "mount_fuji", element: undefined },
  { name: "mountain_bicyclist", element: undefined },
  { name: "mountain_cableway", element: undefined },
  { name: "mountain_railway", element: undefined },
  { name: "mouse", element: undefined },
  { name: "mouse2", element: undefined },
  { name: "movie_camera", element: undefined },
  { name: "moyai", element: undefined },
  { name: "muscle", element: undefined },
  { name: "mushroom", element: undefined },
  { name: "musical_keyboard", element: undefined },
  { name: "musical_note", element: undefined },
  { name: "musical_score", element: undefined },
  { name: "mute", element: undefined },
  { name: "nail_care", element: undefined },
  { name: "name_badge", element: undefined },
  { name: "neckbeard", element: undefined },
  { name: "necktie", element: undefined },
  { name: "negative_squared_cross_mark", element: undefined },
  { name: "neutral_face", element: undefined },
  { name: "new", element: undefined },
  { name: "new_moon", element: undefined },
  { name: "new_moon_with_face", element: undefined },
  { name: "newspaper", element: undefined },
  { name: "ng", element: undefined },
  { name: "nine", element: undefined },
  { name: "no_bell", element: undefined },
  { name: "no_bicycles", element: undefined },
  { name: "no_entry", element: undefined },
  { name: "no_entry_sign", element: undefined },
  { name: "no_good", element: undefined },
  { name: "no_mobile_phones", element: undefined },
  { name: "no_mouth", element: undefined },
  { name: "no_pedestrians", element: undefined },
  { name: "no_smoking", element: undefined },
  { name: "non-potable_water", element: undefined },
  { name: "nose", element: undefined },
  { name: "notebook", element: undefined },
  { name: "notebook_with_decorative_cover", element: undefined },
  { name: "notes", element: undefined },
  { name: "nut_and_bolt", element: undefined },
  { name: "o", element: undefined },
  { name: "o2", element: undefined },
  { name: "ocean", element: undefined },
  { name: "octocat", element: undefined },
  { name: "octopus", element: undefined },
  { name: "oden", element: undefined },
  { name: "office", element: undefined },
  { name: "ok", element: undefined },
  { name: "ok_hand", element: undefined },
  { name: "ok_woman", element: undefined },
  { name: "older_man", element: undefined },
  { name: "older_woman", element: undefined },
  { name: "on", element: undefined },
  { name: "oncoming_automobile", element: undefined },
  { name: "oncoming_bus", element: undefined },
  { name: "oncoming_police_car", element: undefined },
  { name: "oncoming_taxi", element: undefined },
  { name: "one", element: undefined },
  { name: "onehundred", element: undefined },
  { name: "onetwothreefour", element: undefined },
  { name: "open_book", element: undefined },
  { name: "open_file_folder", element: undefined },
  { name: "open_hands", element: undefined },
  { name: "open_mouth", element: undefined },
  { name: "ophiuchus", element: undefined },
  { name: "orange_book", element: undefined },
  { name: "outbox_tray", element: undefined },
  { name: "ox", element: undefined },
  { name: "package", element: undefined },
  { name: "page_facing_up", element: undefined },
  { name: "page_with_curl", element: undefined },
  { name: "pager", element: undefined },
  { name: "palm_tree", element: undefined },
  { name: "panda_face", element: undefined },
  { name: "paperclip", element: undefined },
  { name: "parking", element: undefined },
  { name: "part_alternation_mark", element: undefined },
  { name: "partly_sunny", element: undefined },
  { name: "passport_control", element: undefined },
  { name: "paw_prints", element: undefined },
  { name: "peach", element: undefined },
  { name: "pear", element: undefined },
  { name: "pencil", element: undefined },
  { name: "pencil2", element: undefined },
  { name: "penguin", element: undefined },
  { name: "pensive", element: undefined },
  { name: "performing_arts", element: undefined },
  { name: "persevere", element: undefined },
  { name: "person_frowning", element: undefined },
  { name: "person_with_blond_hair", element: undefined },
  { name: "person_with_pouting_face", element: undefined },
  { name: "phone", element: undefined },
  { name: "pig", element: undefined },
  { name: "pig2", element: undefined },
  { name: "pig_nose", element: undefined },
  { name: "pill", element: undefined },
  { name: "pineapple", element: undefined },
  { name: "pisces", element: undefined },
  { name: "pizza", element: undefined },
  { name: "plusone", element: undefined },
  { name: "point_down", element: undefined },
  { name: "point_left", element: undefined },
  { name: "point_right", element: undefined },
  { name: "point_up", element: undefined },
  { name: "point_up_2", element: undefined },
  { name: "police_car", element: undefined },
  { name: "poodle", element: undefined },
  { name: "poop", element: undefined },
  { name: "post_office", element: undefined },
  { name: "postal_horn", element: undefined },
  { name: "postbox", element: undefined },
  { name: "potable_water", element: undefined },
  { name: "pouch", element: undefined },
  { name: "poultry_leg", element: undefined },
  { name: "pound", element: undefined },
  { name: "pouting_cat", element: undefined },
  { name: "pray", element: undefined },
  { name: "princess", element: undefined },
  { name: "punch", element: undefined },
  { name: "purple_heart", element: undefined },
  { name: "purse", element: undefined },
  { name: "pushpin", element: undefined },
  { name: "put_litter_in_its_place", element: undefined },
  { name: "question", element: undefined },
  { name: "rabbit", element: undefined },
  { name: "rabbit2", element: undefined },
  { name: "racehorse", element: undefined },
  { name: "radio", element: undefined },
  { name: "radio_button", element: undefined },
  { name: "rage", element: undefined },
  { name: "rage1", element: undefined },
  { name: "rage2", element: undefined },
  { name: "rage3", element: undefined },
  { name: "rage4", element: undefined },
  { name: "railway_car", element: undefined },
  { name: "rainbow", element: undefined },
  { name: "raised_hand", element: undefined },
  { name: "raised_hands", element: undefined },
  { name: "raising_hand", element: undefined },
  { name: "ram", element: undefined },
  { name: "ramen", element: undefined },
  { name: "rat", element: undefined },
  { name: "recycle", element: undefined },
  { name: "red_car", element: undefined },
  { name: "red_circle", element: undefined },
  { name: "registered", element: undefined },
  { name: "relaxed", element: undefined },
  { name: "relieved", element: undefined },
  { name: "repeat", element: undefined },
  { name: "repeat_one", element: undefined },
  { name: "restroom", element: undefined },
  { name: "revolving_hearts", element: undefined },
  { name: "rewind", element: undefined },
  { name: "ribbon", element: undefined },
  { name: "rice", element: undefined },
  { name: "rice_ball", element: undefined },
  { name: "rice_cracker", element: undefined },
  { name: "rice_scene", element: undefined },
  { name: "ring", element: undefined },
  { name: "rocket", element: undefined },
  { name: "roller_coaster", element: undefined },
  { name: "rooster", element: undefined },
  { name: "rose", element: undefined },
  { name: "rotating_light", element: undefined },
  { name: "round_pushpin", element: undefined },
  { name: "rowboat", element: undefined },
  { name: "ru", element: undefined },
  { name: "rugby_football", element: undefined },
  { name: "runner", element: undefined },
  { name: "running", element: undefined },
  { name: "running_shirt_with_sash", element: undefined },
  { name: "sa", element: undefined },
  { name: "sagittarius", element: undefined },
  { name: "sailboat", element: undefined },
  { name: "sake", element: undefined },
  { name: "sandal", element: undefined },
  { name: "santa", element: undefined },
  { name: "satellite", element: undefined },
  { name: "satisfied", element: undefined },
  { name: "saxophone", element: undefined },
  { name: "school", element: undefined },
  { name: "school_satchel", element: undefined },
  { name: "scissors", element: undefined },
  { name: "scorpius", element: undefined },
  { name: "scream", element: undefined },
  { name: "scream_cat", element: undefined },
  { name: "scroll", element: undefined },
  { name: "seat", element: undefined },
  { name: "secret", element: undefined },
  { name: "see_no_evil", element: undefined },
  { name: "seedling", element: undefined },
  { name: "seven", element: undefined },
  { name: "shaved_ice", element: undefined },
  { name: "sheep", element: undefined },
  { name: "shell", element: undefined },
  { name: "ship", element: undefined },
  { name: "shipit", element: undefined },
  { name: "shirt", element: undefined },
  { name: "shit", element: undefined },
  { name: "shoe", element: undefined },
  { name: "shower", element: undefined },
  { name: "signal_strength", element: undefined },
  { name: "six", element: undefined },
  { name: "six_pointed_star", element: undefined },
  { name: "ski", element: undefined },
  { name: "skull", element: undefined },
  { name: "sleeping", element: undefined },
  { name: "sleepy", element: undefined },
  { name: "slot_machine", element: undefined },
  { name: "small_blue_diamond", element: undefined },
  { name: "small_orange_diamond", element: undefined },
  { name: "small_red_triangle", element: undefined },
  { name: "small_red_triangle_down", element: undefined },
  { name: "smile", element: undefined },
  { name: "smile_cat", element: undefined },
  { name: "smiley", element: undefined },
  { name: "smiley_cat", element: undefined },
  { name: "smiling_imp", element: undefined },
  { name: "smirk", element: undefined },
  { name: "smirk_cat", element: undefined },
  { name: "smoking", element: undefined },
  { name: "snail", element: undefined },
  { name: "snake", element: undefined },
  { name: "snowboarder", element: undefined },
  { name: "snowflake", element: undefined },
  { name: "snowman", element: undefined },
  { name: "sob", element: undefined },
  { name: "soccer", element: undefined },
  { name: "soon", element: undefined },
  { name: "sos", element: undefined },
  { name: "sound", element: undefined },
  { name: "space_invader", element: undefined },
  { name: "spades", element: undefined },
  { name: "spaghetti", element: undefined },
  { name: "sparkle", element: undefined },
  { name: "sparkler", element: undefined },
  { name: "sparkles", element: undefined },
  { name: "sparkling_heart", element: undefined },
  { name: "speak_no_evil", element: undefined },
  { name: "speaker", element: undefined },
  { name: "speech_balloon", element: undefined },
  { name: "speedboat", element: undefined },
  { name: "squirrel", element: undefined },
  { name: "star", element: undefined },
  { name: "star2", element: undefined },
  { name: "stars", element: undefined },
  { name: "station", element: undefined },
  { name: "statue_of_liberty", element: undefined },
  { name: "steam_locomotive", element: undefined },
  { name: "stew", element: undefined },
  { name: "straight_ruler", element: undefined },
  { name: "strawberry", element: undefined },
  { name: "stuck_out_tongue", element: undefined },
  { name: "stuck_out_tongue_closed_eyes", element: undefined },
  { name: "stuck_out_tongue_winking_eye", element: undefined },
  { name: "sun_with_face", element: undefined },
  { name: "sunflower", element: undefined },
  { name: "sunglasses", element: undefined },
  { name: "sunny", element: undefined },
  { name: "sunrise", element: undefined },
  { name: "sunrise_over_mountains", element: undefined },
  { name: "surfer", element: undefined },
  { name: "sushi", element: undefined },
  { name: "suspect", element: undefined },
  { name: "suspension_railway", element: undefined },
  { name: "sweat", element: undefined },
  { name: "sweat_drops", element: undefined },
  { name: "sweat_smile", element: undefined },
  { name: "sweet_potato", element: undefined },
  { name: "swimmer", element: undefined },
  { name: "symbols", element: undefined },
  { name: "syringe", element: undefined },
  { name: "tada", element: undefined },
  { name: "tanabata_tree", element: undefined },
  { name: "tangerine", element: undefined },
  { name: "taurus", element: undefined },
  { name: "taxi", element: undefined },
  { name: "tea", element: undefined },
  { name: "telephone", element: undefined },
  { name: "telephone_receiver", element: undefined },
  { name: "telescope", element: undefined },
  { name: "tennis", element: undefined },
  { name: "tent", element: undefined },
  { name: "thought_balloon", element: undefined },
  { name: "three", element: undefined },
  { name: "thumbsdown", element: undefined },
  { name: "thumbsup", element: undefined },
  { name: "ticket", element: undefined },
  { name: "tiger", element: undefined },
  { name: "tiger2", element: undefined },
  { name: "tired_face", element: undefined },
  { name: "tm", element: undefined },
  { name: "toilet", element: undefined },
  { name: "tokyo_tower", element: undefined },
  { name: "tomato", element: undefined },
  { name: "tongue", element: undefined },
  { name: "top", element: undefined },
  { name: "tophat", element: undefined },
  { name: "tractor", element: undefined },
  { name: "traffic_light", element: undefined },
  { name: "train", element: undefined },
  { name: "train2", element: undefined },
  { name: "tram", element: undefined },
  { name: "triangular_flag_on_post", element: undefined },
  { name: "triangular_ruler", element: undefined },
  { name: "trident", element: undefined },
  { name: "triumph", element: undefined },
  { name: "trolleybus", element: undefined },
  { name: "trollface", element: undefined },
  { name: "trophy", element: undefined },
  { name: "tropical_drink", element: undefined },
  { name: "tropical_fish", element: undefined },
  { name: "truck", element: undefined },
  { name: "trumpet", element: undefined },
  { name: "tshirt", element: undefined },
  { name: "tulip", element: undefined },
  { name: "turtle", element: undefined },
  { name: "tv", element: undefined },
  { name: "twisted_rightwards_arrows", element: undefined },
  { name: "two", element: undefined },
  { name: "two_hearts", element: undefined },
  { name: "two_men_holding_hands", element: undefined },
  { name: "two_women_holding_hands", element: undefined },
  { name: "u5272", element: undefined },
  { name: "u5408", element: undefined },
  { name: "u55b6", element: undefined },
  { name: "u6307", element: undefined },
  { name: "u6708", element: undefined },
  { name: "u6709", element: undefined },
  { name: "u6e80", element: undefined },
  { name: "u7121", element: undefined },
  { name: "u7533", element: undefined },
  { name: "u7981", element: undefined },
  { name: "u7a7a", element: undefined },
  { name: "uk", element: undefined },
  { name: "umbrella", element: undefined },
  { name: "unamused", element: undefined },
  { name: "underage", element: undefined },
  { name: "unlock", element: undefined },
  { name: "up", element: undefined },
  { name: "us", element: undefined },
  { name: "v", element: undefined },
  { name: "vertical_traffic_light", element: undefined },
  { name: "vhs", element: undefined },
  { name: "vibration_mode", element: undefined },
  { name: "video_camera", element: undefined },
  { name: "video_game", element: undefined },
  { name: "violin", element: undefined },
  { name: "virgo", element: undefined },
  { name: "volcano", element: undefined },
  { name: "vs", element: undefined },
  { name: "walking", element: undefined },
  { name: "waning_crescent_moon", element: undefined },
  { name: "waning_gibbous_moon", element: undefined },
  { name: "warning", element: undefined },
  { name: "watch", element: undefined },
  { name: "water_buffalo", element: undefined },
  { name: "watermelon", element: undefined },
  { name: "wave", element: undefined },
  { name: "wavy_dash", element: undefined },
  { name: "waxing_crescent_moon", element: undefined },
  { name: "waxing_gibbous_moon", element: undefined },
  { name: "wc", element: undefined },
  { name: "weary", element: undefined },
  { name: "wedding", element: undefined },
  { name: "whale", element: undefined },
  { name: "whale2", element: undefined },
  { name: "wheelchair", element: undefined },
  { name: "white_check_mark", element: undefined },
  { name: "white_circle", element: undefined },
  { name: "white_flower", element: undefined },
  { name: "white_large_square", element: undefined },
  { name: "white_medium_small_square", element: undefined },
  { name: "white_medium_square", element: undefined },
  { name: "white_small_square", element: undefined },
  { name: "white_square_button", element: undefined },
  { name: "wind_chime", element: undefined },
  { name: "wine_glass", element: undefined },
  { name: "wink", element: undefined },
  { name: "wolf", element: undefined },
  { name: "woman", element: undefined },
  { name: "womans_clothes", element: undefined },
  { name: "womans_hat", element: undefined },
  { name: "womens", element: undefined },
  { name: "worried", element: undefined },
  { name: "wrench", element: undefined },
  { name: "x", element: undefined },
  { name: "yellow_heart", element: undefined },
  { name: "yen", element: undefined },
  { name: "yum", element: undefined },
  { name: "zap", element: undefined },
  { name: "zero", element: undefined },
  { name: "zzz", element: undefined }
];

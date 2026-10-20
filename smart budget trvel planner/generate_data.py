import json
import os

destinations = [
    {
        "id": "goa",
        "name": "Goa",
        "state": "Goa",
        "region": "West",
        "category": ["Beach", "Nightlife", "Water Sports", "Relaxation", "Food"],
        "best_season": "Nov - Feb",
        "best_months": [11, 12, 1, 2],
        "ideal_days": 4,
        "avg_daily_cost": {"budget": 1800, "standard": 4200, "premium": 9500},
        "nearest_railway": "Madgaon Junction (MAO) / Thivim (THVM)",
        "nearest_airport": "Dabolim Airport (GOI) / Mopa (GOX)",
        "attractions": [
            {"name": "Baga & Calangute Beach", "fee": 0, "timeNeeded": "3 hrs", "category": "Beach", "description": "Vibrant beach famous for water sports, beach shacks, and sunset strolls."},
            {"name": "Aguada Fort & Lighthouse", "fee": 50, "timeNeeded": "2 hrs", "category": "History", "description": "17th-century Portuguese fort overlooking the Arabian Sea."},
            {"name": "Basilica of Bom Jesus", "fee": 0, "timeNeeded": "1.5 hrs", "category": "Spiritual", "description": "UNESCO World Heritage site holding mortal remains of St. Francis Xavier."},
            {"name": "Dudhsagar Waterfalls", "fee": 500, "timeNeeded": "5 hrs", "category": "Nature", "description": "Four-tiered majestic waterfall cascading like a sea of milk."},
            {"name": "Anjuna Flea Market & Curlies", "fee": 0, "timeNeeded": "2.5 hrs", "category": "Shopping", "description": "Bohemian vibes, souvenirs, local handicrafts, and sea-view cafes."},
            {"name": "Palolem Beach & Silent Disco", "fee": 0, "timeNeeded": "3 hrs", "category": "Beach", "description": "Crescent-shaped pristine South Goa beach famous for gentle waters."},
            {"name": "Chapora Fort", "fee": 0, "timeNeeded": "1.5 hrs", "category": "History", "description": "Famous 'Dil Chahta Hai' fort with panoramic views of Vagator Beach."}
        ],
        "local_foods": [
            {"name": "Goan Fish Curry & Rice", "desc": "Spicy and tangy coconut-based Kingfish/Pomfret curry", "price": 280, "veg": False},
            {"name": "Bebinca", "desc": "Traditional 7-layered Indo-Portuguese dessert", "price": 160, "veg": True},
            {"name": "Pork / Chicken Vindaloo", "desc": "Classic vinegary fiery stew with Goan spices", "price": 340, "veg": False},
            {"name": "Prawn Balchão & Poi Bread", "desc": "Pickled prawn masala paired with fresh Goan crusty bread", "price": 320, "veg": False}
        ],
        "local_transport": [
            {"mode": "Scooter / Activa Rental", "costPerDay": 400, "desc": "Best for exploring coastal lanes and beaches easily", "icon": "bike"},
            {"mode": "Self-Drive Hatchback", "costPerDay": 1400, "desc": "Convenient for families and long South-to-North drives", "icon": "car"},
            {"mode": "Local Taxi / GoaMiles", "costPerDay": 2200, "desc": "On-demand cabs for hassle-free point-to-point travel", "icon": "taxi"}
        ],
        "hotels": {
            "budget": {"name": "Zostel Goa / Rainbow Shack", "pricePerNight": 900, "rating": 4.4, "amenities": ["WiFi", "Bunk Beds", "Social Lounge", "Cafe"]},
            "standard": {"name": "BloomSuites / Lemon Tree Amarante", "pricePerNight": 3400, "rating": 4.6, "amenities": ["Pool", "AC Room", "Breakfast", "Near Beach"]},
            "luxury": {"name": "Taj Exotica / W Goa Vagator", "pricePerNight": 12500, "rating": 4.9, "amenities": ["Private Beach Access", "Infinity Pool", "Spa & Butler", "Fine Dining"]}
        },
        "activities": [
            {"id": "act_scuba", "name": "Grand Island Scuba Diving & Dolphin Cruise", "duration": "5 hrs", "price": 2499, "tier": "standard", "category": "Adventure", "desc": "Includes boat ride, equipment, PADI dive master guide, and GoPro video."},
            {"id": "act_water_sports", "name": "Parasailing & Jet Ski Combo (Calangute)", "duration": "2 hrs", "price": 1399, "tier": "budget", "category": "Adventure", "desc": "High-flying ocean parasailing with dip plus thrilling jet ski sprint."},
            {"id": "act_mandovi_cruise", "name": "Mandovi River Sunset Luxury Cruise", "duration": "2 hrs", "price": 850, "tier": "budget", "category": "Sightseeing", "desc": "Live DJ, Goan folk dance performances, sightseeing bridge views."},
            {"id": "act_spice_plantation", "name": "Sahakari Spice Farm Tour & Organic Buffet", "duration": "3 hrs", "price": 600, "tier": "budget", "category": "Food & Culture", "desc": "Guided spice walk, elephant shower, and authentic buffet on banana leaf."}
        ],
        "rating": 4.8,
        "popularity_score": 99,
        "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80",
        "emergency": {"police": "112", "hospital": "0832-2223841 (Goa Medical College)", "ambulance": "108", "touristHelpline": "1363"},
        "eco_score": "B+"
    },
    {
        "id": "jaipur",
        "name": "Jaipur",
        "state": "Rajasthan",
        "region": "North",
        "category": ["Heritage", "Palaces", "Culture", "Shopping", "Food"],
        "best_season": "Oct - Mar",
        "best_months": [10, 11, 12, 1, 2, 3],
        "ideal_days": 3,
        "avg_daily_cost": {"budget": 1400, "standard": 3200, "premium": 8500},
        "nearest_railway": "Jaipur Junction (JP)",
        "nearest_airport": "Jaipur International Airport (JAI)",
        "attractions": [
            {"name": "Hawa Mahal (Palace of Winds)", "fee": 50, "timeNeeded": "1 hr", "category": "Heritage", "description": "Iconic five-story pink sandstone palace with 953 ornate jharokhas."},
            {"name": "Amber Fort & Palace", "fee": 100, "timeNeeded": "3.5 hrs", "category": "Heritage", "description": "Majestic hilltop fort with Sheesh Mahal (Mirror Palace) and Maota lake."},
            {"name": "City Palace & Museum", "fee": 300, "timeNeeded": "2 hrs", "category": "Heritage", "description": "Royal residence blending Rajput, Mughal, and European architecture."},
            {"name": "Jantar Mantar", "fee": 50, "timeNeeded": "1.5 hrs", "category": "Heritage", "description": "UNESCO World Heritage 18th-century astronomical observatory."},
            {"name": "Nahargarh Fort Sunset Point", "fee": 50, "timeNeeded": "2 hrs", "category": "Sightseeing", "description": "Panoramic sunset view of the entire Pink City skyline."}
        ],
        "local_foods": [
            {"name": "Dal Baati Churma Thali", "desc": "Crispy wheat balls baked in ghee with lentils and sweet churma", "price": 350, "veg": True},
            {"name": "Pyaaz Kachori & Mirchi Vada", "desc": "Famous spicy onion pastry from Rawat Mishtan Bhandar", "price": 80, "veg": True},
            {"name": "Laal Maas", "desc": "Fiery mutton curry prepared with authentic Mathania chillies", "price": 420, "veg": False}
        ],
        "local_transport": [
            {"mode": "E-Rickshaw / Auto", "costPerDay": 500, "desc": "Agile and quick through narrow old walled city lanes", "icon": "auto"},
            {"mode": "Full Day Cab with Driver", "costPerDay": 1600, "desc": "Comfortable air-conditioned travel covering Amber & Nahargarh", "icon": "car"}
        ],
        "hotels": {
            "budget": {"name": "Moustache Jaipur / Hostel Triangle", "pricePerNight": 750, "rating": 4.5, "amenities": ["WiFi", "Rooftop Cafe", "Lockers"]},
            "standard": {"name": "Umaid Bhawan Heritage / Shahpura House", "pricePerNight": 3200, "rating": 4.7, "amenities": ["Heritage Decor", "Pool", "Buffet Breakfast"]},
            "luxury": {"name": "Rambagh Palace / The Leela Palace", "pricePerNight": 16500, "rating": 4.95, "amenities": ["Royal Suites", "Butler Service", "Peacock Gardens", "Luxury Spa"]}
        },
        "activities": [
            {"id": "act_hot_air_balloon", "name": "Hot Air Balloon Safari over Amer Fort", "duration": "3 hrs", "price": 8500, "tier": "premium", "category": "Adventure", "desc": "Breathtaking sunrise flight over Aravali hills and royal palaces."},
            {"id": "act_chokhi_dhani", "name": "Chokhi Dhani Cultural Village & Royal Dinner", "duration": "4 hrs", "price": 1100, "tier": "standard", "category": "Culture", "desc": "Puppet show, Kalbeliya folk dance, camel ride, and traditional dinner."}
        ],
        "rating": 4.7,
        "popularity_score": 96,
        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
        "emergency": {"police": "112", "hospital": "0141-2560291 (SMS Hospital)", "ambulance": "108", "touristHelpline": "1363"},
        "eco_score": "A"
    }
]

# We will load and append the full list of 45 destinations systematically
destinations_info = [
    # (id, name, state, region, categories, season, months, days, costs, train, air, attractions, foods, image)
    ("udaipur", "Udaipur", "Rajasthan", "North", ["Lakes", "Romance", "Heritage", "Palaces"], "Sep - Mar", [9,10,11,12,1,2,3], 3, (1500, 3800, 11000), "Udaipur City (UDZ)", "Maharana Pratap Airport (UDR)", "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1000&auto=format&fit=crop&q=80", "City Palace Udaipur", "Gatte Ki Sabzi", 4.9, 97),
    ("manali", "Manali", "Himachal Pradesh", "North", ["Snow", "Mountains", "Adventure", "Honeymoon"], "Dec - Feb / Apr - Jun", [12,1,2,4,5,6], 4, (1600, 3600, 8900), "Chandigarh (CDG)", "Bhuntar Kullu (KUU)", "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&auto=format&fit=crop&q=80", "Solang Valley", "Siddu with Ghee", 4.8, 98),
    ("varanasi", "Varanasi", "Uttar Pradesh", "North", ["Spiritual", "Heritage", "Ghats", "Culture"], "Oct - Mar", [10,11,12,1,2,3], 3, (1100, 2600, 7000), "Varanasi Jn (BSB)", "LBS Airport (VNS)", "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80", "Kashi Vishwanath & Ganga Aarti", "Banarasi Paan & Kachori", 4.8, 95),
    ("leh_ladakh", "Leh-Ladakh", "Ladakh", "North", ["Adventure", "Mountains", "Biking", "Lakes"], "May - Sep", [5,6,7,8,9], 6, (2200, 5200, 12500), "Jammu Tawi (JAT)", "Leh Airport (IXL)", "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1000&auto=format&fit=crop&q=80", "Pangong Tso & Nubra Valley", "Thukpa & Butter Tea", 4.95, 97),
    ("kerala_munnar", "Munnar", "Kerala", "South", ["Tea Gardens", "Hills", "Nature", "Honeymoon"], "Sep - Mar", [9,10,11,12,1,2,3], 3, (1400, 3400, 8200), "Aluva (AWY)", "Cochin Airport (COK)", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&auto=format&fit=crop&q=80", "Eravikulam & Top Station", "Appam with Stew", 4.8, 96),
    ("kerala_alleppey", "Alleppey", "Kerala", "South", ["Backwaters", "Houseboats", "Beaches", "Relaxation"], "Oct - Mar", [10,11,12,1,2,3], 2, (1500, 3800, 9200), "Alappuzha (ALLP)", "Cochin Airport (COK)", "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1000&auto=format&fit=crop&q=80", "Backwaters Houseboat Cruise", "Karimeen Pollichathu", 4.8, 95),
    ("rishikesh", "Rishikesh", "Uttarakhand", "North", ["Spiritual", "Adventure", "Rafting", "Yoga"], "Sep - Nov / Mar - May", [9,10,11,3,4,5], 3, (1100, 2800, 7800), "Rishikesh (YNRK)", "Dehradun (DED)", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&auto=format&fit=crop&q=80", "Laxman Jhula & White Water Rafting", "Aloo Puri & Vegan Cafe Food", 4.8, 97),
    ("agra", "Agra", "Uttar Pradesh", "North", ["Heritage", "Wonders of World", "Mughal", "History"], "Oct - Mar", [10,11,12,1,2,3], 2, (1200, 2900, 8500), "Agra Cantt (AGC)", "Delhi IGI (DEL)", "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=80", "Taj Mahal & Agra Fort", "Petha & Bedmi Puri", 4.7, 99),
    ("hampi", "Hampi", "Karnataka", "South", ["Heritage", "Ruins", "Architecture", "Bouldering"], "Oct - Feb", [10,11,12,1,2], 3, (1100, 2700, 7200), "Hosapete (HPT)", "Hubballi / Bangalore", "https://images.unsplash.com/photo-1600100397608-f010e42e4e7e?w=1000&auto=format&fit=crop&q=80", "Stone Chariot & Virupaksha", "Unlimited Banana Leaf Meals", 4.85, 94),
    ("andaman", "Andaman (Port Blair & Havelock)", "Andaman & Nicobar", "Islands", ["Islands", "Beaches", "Scuba", "Coral Reef"], "Oct - May", [10,11,12,1,2,3,4,5], 5, (2400, 5500, 14000), "Port Blair Port", "Port Blair Airport (IXZ)", "https://images.unsplash.com/photo-1589136777351-fdc9c9cab193?w=1000&auto=format&fit=crop&q=80", "Radhanagar Beach & Cellular Jail", "Grilled Lobster & Seafood", 4.9, 96),
    ("darjeeling", "Darjeeling", "West Bengal", "East", ["Tea Gardens", "Mountains", "Toy Train", "Kanchenjunga"], "Mar - May / Oct - Dec", [3,4,5,10,11,12], 3, (1300, 3100, 7800), "New Jalpaiguri (NJP)", "Bagdogra Airport (IXB)", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&auto=format&fit=crop&q=80", "Tiger Hill & Toy Train", "Darjeeling Tea & Momos", 4.7, 94),
    ("amritsar", "Amritsar", "Punjab", "North", ["Spiritual", "Heritage", "Food", "Patriotism"], "Oct - Mar", [10,11,12,1,2,3], 2, (1000, 2500, 6800), "Amritsar Jn (ASR)", "Amritsar Airport (ATQ)", "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=1000&auto=format&fit=crop&q=80", "Golden Temple & Wagah Border", "Amritsari Kulcha & Lassi", 4.9, 98),
    ("pune", "Pune", "Maharashtra", "West", ["Culture", "IT Hub", "Forts", "Food"], "Jul - Feb", [7,8,9,10,11,12,1,2], 2, (1100, 2600, 6500), "Pune Jn (PUNE)", "Pune Airport (PNQ)", "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1000&auto=format&fit=crop&q=80", "Shaniwar Wada & Sinhagad", "Misal Pav & Bakharwadi", 4.6, 91),
    ("mumbai", "Mumbai", "Maharashtra", "West", ["Metropolis", "Heritage", "Bollywood", "Food"], "Nov - Feb", [11,12,1,2], 3, (1500, 4200, 12000), "Mumbai CSMT (CSMT)", "Mumbai Airport (BOM)", "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1000&auto=format&fit=crop&q=80", "Gateway of India & Marine Drive", "Vada Pav & Pav Bhaji", 4.8, 99),
    ("lonavala", "Lonavala", "Maharashtra", "West", ["Hills", "Monsoon", "Waterfalls", "Caves"], "Jun - Sep / Oct - Feb", [6,7,8,9,10,11,12,1,2], 2, (1200, 2800, 7500), "Lonavala (LNL)", "Pune / Mumbai", "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000&auto=format&fit=crop&q=80", "Tiger Point & Bhushi Dam", "Chikki & Corn Pakodas", 4.6, 93),
    ("mahabaleshwar", "Mahabaleshwar", "Maharashtra", "West", ["Hills", "Strawberries", "Viewpoints", "Nature"], "Oct - Jun", [10,11,12,1,2,3,4,5], 3, (1300, 3000, 7600), "Satara (STR) / Pune", "Pune Airport (PNQ)", "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000&auto=format&fit=crop&q=80", "Arthur's Seat & Venna Lake", "Fresh Strawberries with Cream", 4.7, 92),
    ("haridwar", "Haridwar", "Uttarakhand", "North", ["Spiritual", "Ghats", "Temples", "Culture"], "Sep - Apr", [9,10,11,12,1,2,3,4], 2, (950, 2300, 5800), "Haridwar Jn (HW)", "Dehradun (DED)", "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80", "Har Ki Pauri & Mansa Devi", "Kachori & Jalebi", 4.7, 93),
    ("shimla", "Shimla", "Himachal Pradesh", "North", ["Hills", "Snow", "Colonial", "Mall Road"], "Dec - Feb / Mar - Jun", [12,1,2,3,4,5,6], 3, (1500, 3500, 8800), "Kalka (KLK)", "Chandigarh (CDG)", "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1000&auto=format&fit=crop&q=80", "The Ridge & Jakhu Temple", "Himachali Madra & Strudel", 4.7, 95),
    ("srinagar", "Srinagar", "Jammu and Kashmir", "North", ["Lakes", "Houseboats", "Snow", "Gardens"], "Apr - Oct / Dec - Feb", [4,5,6,7,8,9,10,12,1,2], 4, (1800, 4500, 11500), "Jammu Tawi (JAT)", "Srinagar Airport (SXR)", "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1000&auto=format&fit=crop&q=80", "Dal Lake Shikara & Gulmarg", "Kashmiri Wazwan & Kahwa", 4.9, 97),
    ("pondicherry", "Pondicherry", "Puducherry", "South", ["French Quarter", "Beaches", "Spiritual", "Cafes"], "Oct - Mar", [10,11,12,1,2,3], 3, (1200, 3000, 7600), "Puducherry (PDY)", "Chennai Airport (MAA)", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80", "White Town & Auroville", "Croissants & Creole Curry", 4.75, 95),
    ("dharamshala", "Dharamshala", "Himachal Pradesh", "North", ["Tibetan Culture", "Mountains", "Trekking", "Peace"], "Mar - Jun / Sep - Dec", [3,4,5,6,9,10,11,12], 3, (1200, 2900, 7200), "Pathankot (PTKC)", "Kangra Airport (DHM)", "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1000&auto=format&fit=crop&q=80", "Dalai Lama Temple & Triund Trek", "Tibetan Momos & Bhagsu Cake", 4.75, 94),
    ("coorg", "Coorg", "Karnataka", "South", ["Coffee Plantations", "Hills", "Waterfalls", "Nature"], "Oct - Mar", [10,11,12,1,2,3], 3, (1400, 3400, 8800), "Mysuru (MYS)", "Kannur / Bangalore", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&auto=format&fit=crop&q=80", "Abbey Falls & Dubare Elephant Camp", "Pandi Curry & Fresh Coffee", 4.8, 94),
    ("ooty", "Ooty", "Tamil Nadu", "South", ["Hills", "Toy Train", "Tea Gardens", "Lakes"], "Mar - Jun / Oct - Jan", [3,4,5,6,10,11,12,1], 3, (1300, 3200, 8200), "Mettupalayam (MTP)", "Coimbatore Airport (CJB)", "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1000&auto=format&fit=crop&q=80", "Nilgiri Mountain Railway & Doddabetta", "Homemade Chocolates & Varkey", 4.75, 95),
    ("delhi", "Delhi", "Delhi", "North", ["Heritage", "Capital", "Food", "Monuments"], "Oct - Mar", [10,11,12,1,2,3], 3, (1200, 3200, 9500), "New Delhi (NDLS)", "Delhi IGI Airport (DEL)", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000&auto=format&fit=crop&q=80", "Qutub Minar & Red Fort", "Butter Chicken & Chole Bhature", 4.7, 99),
    ("rann_of_kutch", "Rann of Kutch", "Gujarat", "West", ["White Desert", "Culture", "Handicrafts", "Rann Utsav"], "Nov - Feb", [11,12,1,2], 3, (1600, 4500, 11000), "Bhuj (BHUJ)", "Bhuj Airport (BHJ)", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80", "White Rann Desert & Kala Dungar", "Kutchi Dabeli & Kathiyawadi Thali", 4.85, 95),
    ("statue_of_unity", "Statue of Unity", "Gujarat", "West", ["Tallest Statue", "Engineering", "Gardens", "River"], "Oct - Mar", [10,11,12,1,2,3], 2, (1300, 3200, 7800), "Ekta Nagar (EKNR)", "Vadodara Airport (BDQ)", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80", "182m Statue & Sardar Sarovar Dam", "Gujarati Thali & Farsan", 4.75, 96),
    ("jodhpur", "Jodhpur", "Rajasthan", "North", ["Blue City", "Forts", "Heritage", "Food"], "Oct - Mar", [10,11,12,1,2,3], 2, (1200, 2900, 8200), "Jodhpur Jn (JU)", "Jodhpur Airport (JDH)", "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80", "Mehrangarh Fort & Jaswant Thada", "Mawa Kachori & Mirchi Bada", 4.8, 95),
    ("jaisalmer", "Jaisalmer", "Rajasthan", "North", ["Golden City", "Desert Safari", "Forts", "Camping"], "Oct - Mar", [10,11,12,1,2,3], 3, (1400, 3400, 8500), "Jaisalmer (JSM)", "Jaisalmer Airport (JSA)", "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80", "Sonar Qila & Sam Sand Dunes", "Ker Sangri & Laal Maas", 4.85, 96),
    ("khajuraho", "Khajuraho", "Madhya Pradesh", "Central", ["Heritage", "Sculpture", "Architecture", "Temples"], "Oct - Mar", [10,11,12,1,2,3], 2, (1100, 2600, 6800), "Khajuraho (KURJ)", "Khajuraho Airport (HJR)", "https://images.unsplash.com/photo-1600100397608-f010e42e4e7e?w=1000&auto=format&fit=crop&q=80", "Western Group of Temples & Raneh Falls", "Bundelkhandi Thali", 4.7, 91),
    ("mysore", "Mysore", "Karnataka", "South", ["Palaces", "Heritage", "Silk", "Gardens"], "Sep - Mar", [9,10,11,12,1,2,3], 2, (1100, 2700, 6900), "Mysuru (MYS)", "Mysore / Bangalore", "https://images.unsplash.com/photo-1600100397608-f010e42e4e7e?w=1000&auto=format&fit=crop&q=80", "Mysore Palace & Chamundi Hill", "Mysore Pak & Mylari Dosa", 4.75, 93),
    ("kochi", "Kochi", "Kerala", "South", ["Colonial", "Chinese Nets", "Spice", "Art"], "Oct - Mar", [10,11,12,1,2,3], 2, (1200, 3000, 7800), "Ernakulam Jn (ERS)", "Cochin Airport (COK)", "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1000&auto=format&fit=crop&q=80", "Fort Kochi & Mattancherry Palace", "Fish Moilee & Appam", 4.7, 93),
    ("gangtok", "Gangtok", "Sikkim", "East", ["Mountains", "Monasteries", "Clean City", "Lakes"], "Mar - May / Oct - Dec", [3,4,5,10,11,12], 3, (1400, 3400, 8200), "New Jalpaiguri (NJP)", "Pakyong / Bagdogra", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&auto=format&fit=crop&q=80", "Tsomgo Lake & Rumtek Monastery", "Sikkimese Momo & Thukpa", 4.85, 95),
    ("shillong", "Shillong", "Meghalaya", "East", ["Waterfalls", "Root Bridges", "Caves", "Lakes"], "Sep - May", [9,10,11,12,1,2,3,4,5], 4, (1400, 3500, 8000), "Guwahati (GHY)", "Shillong Umroi (SHL)", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&auto=format&fit=crop&q=80", "Living Root Bridge & Nohkalikai", "Jadoh & Khasi Special", 4.9, 96),
    ("hyderabad", "Hyderabad", "Telangana", "South", ["Heritage", "Biryani", "Pearls", "Charminar"], "Oct - Mar", [10,11,12,1,2,3], 2, (1100, 2800, 8200), "Secunderabad (SC)", "Hyderabad Airport (HYD)", "https://images.unsplash.com/photo-1600100397608-f010e42e4e7e?w=1000&auto=format&fit=crop&q=80", "Charminar & Golconda Fort", "Dum Biryani & Irani Chai", 4.8, 96),
    ("puri", "Puri", "Odisha", "East", ["Spiritual", "Beaches", "Sun Temple", "Heritage"], "Oct - Mar", [10,11,12,1,2,3], 2, (1000, 2400, 6200), "Puri (PURI)", "Bhubaneswar Airport (BBI)", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80", "Jagannath Temple & Konark Sun Temple", "Mahaprasad & Khaja", 4.7, 93),
    ("madurai", "Madurai", "Tamil Nadu", "South", ["Spiritual", "Temples", "Culture", "Food"], "Oct - Mar", [10,11,12,1,2,3], 2, (1000, 2400, 6500), "Madurai Jn (MDU)", "Madurai Airport (IXM)", "https://images.unsplash.com/photo-1600100397608-f010e42e4e7e?w=1000&auto=format&fit=crop&q=80", "Meenakshi Amman Temple & Palace", "Jigarthanda & Bun Parotta", 4.8, 94),
    ("rameswaram", "Rameswaram", "Tamil Nadu", "South", ["Spiritual", "Island", "Pamban Bridge", "Beaches"], "Oct - Apr", [10,11,12,1,2,3,4], 2, (1100, 2600, 6800), "Rameswaram (RMM)", "Madurai Airport (IXM)", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80", "Ramanathaswamy Temple & Dhanushkodi", "Fresh Crab & Coastal Meals", 4.75, 93),
    ("tirupati", "Tirupati", "Andhra Pradesh", "South", ["Spiritual", "Balaji Temple", "Pilgrimage", "Hills"], "Sep - Feb", [9,10,11,12,1,2], 2, (1000, 2500, 6500), "Tirupati (TPTY)", "Tirupati Airport (TIR)", "https://images.unsplash.com/photo-1600100397608-f010e42e4e7e?w=1000&auto=format&fit=crop&q=80", "Sri Venkateswara Temple Tirumala", "Tirupati Laddu Prasadam", 4.85, 98),
    ("kolkata", "Kolkata", "West Bengal", "East", ["Culture", "Literature", "Colonial", "Food"], "Oct - Mar", [10,11,12,1,2,3], 3, (1100, 2700, 7900), "Howrah (HWH)", "Kolkata Airport (CCU)", "https://images.unsplash.com/photo-1558431382-27e303142255?w=1000&auto=format&fit=crop&q=80", "Victoria Memorial & Howrah Bridge", "Kolkata Biryani & Rosogolla", 4.8, 97),
    ("kodaikanal", "Kodaikanal", "Tamil Nadu", "South", ["Hills", "Lakes", "Forests", "Pine Groves"], "Sep - May", [9,10,11,12,1,2,3,4,5], 3, (1300, 3100, 7900), "Kodai Road (KQN)", "Madurai Airport (IXM)", "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1000&auto=format&fit=crop&q=80", "Kodai Lake & Pillar Rocks", "Homemade Chocolates", 4.75, 94),
    ("nashik", "Nashik", "Maharashtra", "West", ["Wine Capital", "Spiritual", "Godavari", "Vineyards"], "Oct - Mar", [10,11,12,1,2,3], 2, (1200, 3000, 7500), "Nashik Road (NK)", "Nashik / Mumbai", "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000&auto=format&fit=crop&q=80", "Sula Vineyards & Trimbakeshwar", "Misal Pav & Sula Wine", 4.7, 93),
    ("shirdi", "Shirdi", "Maharashtra", "West", ["Spiritual", "Pilgrimage", "Sai Baba", "Peace"], "Jul - Mar", [7,8,9,10,11,12,1,2,3], 2, (900, 2200, 5800), "Sainagar Shirdi (SNSI)", "Shirdi Airport (SAG)", "https://images.unsplash.com/photo-1600100397608-f010e42e4e7e?w=1000&auto=format&fit=crop&q=80", "Sai Baba Samadhi Mandir & Dwarkamai", "Prasadalaya Thali & Fresh Guava", 4.8, 96),
    ("aurangabad", "Aurangabad", "Maharashtra", "West", ["UNESCO Caves", "Kailasa Temple", "Heritage"], "Oct - Mar", [10,11,12,1,2,3], 3, (1200, 2900, 7200), "Aurangabad (AWB)", "Aurangabad Airport (IXU)", "https://images.unsplash.com/photo-1600100397608-f010e42e4e7e?w=1000&auto=format&fit=crop&q=80", "Ajanta & Ellora Caves", "Naan Qalia & Paithani", 4.85, 95),
    ("mahabalipuram", "Mahabalipuram", "Tamil Nadu", "South", ["UNESCO Monoliths", "Shore Temple", "Beaches"], "Oct - Mar", [10,11,12,1,2,3], 2, (1100, 2800, 7600), "Chengalpattu (CGL)", "Chennai Airport (MAA)", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80", "Shore Temple & Pancha Rathas", "Fresh Catch Fish Thali", 4.75, 93),
    ("ujjain", "Ujjain", "Madhya Pradesh", "Central", ["Spiritual", "Jyotirlinga", "Bhasma Aarti", "Kumbh"], "Oct - Mar", [10,11,12,1,2,3], 2, (1000, 2400, 6000), "Ujjain Jn (UJN)", "Indore Airport (IDR)", "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80", "Mahakaleshwar & Mahakal Lok", "Poha Jalebi & Dal Bafla", 4.8, 95),
    ("mount_abu", "Mount Abu", "Rajasthan", "North", ["Hill Station", "Dilwara Temples", "Lakes"], "Sep - Apr", [9,10,11,12,1,2,3,4], 2, (1200, 2900, 7500), "Abu Road (ABR)", "Udaipur / Ahmedabad", "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1000&auto=format&fit=crop&q=80", "Dilwara Temples & Nakki Lake", "Dal Baati & Soft Ice Cream", 4.7, 91),
    ("kedarnath_badrinath", "Kedarnath & Badrinath", "Uttarakhand", "North", ["Chardham", "Spiritual", "Himalayas", "Trekking"], "May - Jun / Sep - Oct", [5,6,9,10], 5, (1800, 4500, 12000), "Rishikesh (YNRK)", "Dehradun (DED)", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&auto=format&fit=crop&q=80", "Kedarnath & Badrinath Temples", "Garhwali Thali & Maggi", 4.95, 99),
    ("gokarna", "Gokarna", "Karnataka", "South", ["Beach", "Trekking", "Spiritual", "Hippie"], "Oct - Mar", [10,11,12,1,2,3], 3, (1100, 2600, 6500), "Gokarna Road (GOK)", "Goa Dabolim Airport", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80", "Om Beach & Mahabaleshwar Temple", "Nutella Pancakes & Fish Curry", 4.75, 94),
    ("spiti_valley", "Spiti Valley", "Himachal Pradesh", "North", ["Cold Desert", "Monasteries", "High Altitude"], "Jun - Oct", [6,7,8,9,10], 6, (1600, 3800, 8500), "Chandigarh (CDG)", "Kullu Airport", "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1000&auto=format&fit=crop&q=80", "Key Gompa & Chandratal Lake", "Seabuckthorn Tea & Tingmo", 4.9, 95),
    ("varkala", "Varkala", "Kerala", "South", ["Beach", "Cliffs", "Ayurveda", "Sunset"], "Oct - Mar", [10,11,12,1,2,3], 3, (1200, 2800, 7200), "Varkala (VAK)", "Trivandrum Airport (TRV)", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80", "North Cliff & Papanasam Beach", "Seafood Platters & Herbal Bowls", 4.8, 95),
    ("pushkar", "Pushkar", "Rajasthan", "North", ["Spiritual", "Camel Fair", "Holy Lake", "Desert"], "Oct - Mar", [10,11,12,1,2,3], 2, (950, 2400, 6500), "Ajmer Jn (AII)", "Jaipur Airport", "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80", "Brahma Temple & 52 Holy Ghats", "Malpua & Falafel", 4.7, 93),
    ("auli", "Auli", "Uttarakhand", "North", ["Skiing", "Snow", "Cable Car", "Himalayas"], "Dec - Mar / Apr - Jun", [12,1,2,3,4,5], 3, (1800, 4200, 10500), "Rishikesh (YNRK)", "Dehradun (DED)", "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&auto=format&fit=crop&q=80", "Auli Ropeway & Gorson Bugyal", "Garhwali Chainsoo & Singori", 4.85, 95)
]

for item in destinations_info:
    (d_id, name, state, region, cat, season, months, days, costs, train, air, img, top_attr, food, rating, pop) = item
    dest = {
        "id": d_id,
        "name": name,
        "state": state,
        "region": region,
        "category": cat,
        "best_season": season,
        "best_months": months,
        "ideal_days": days,
        "avg_daily_cost": {"budget": costs[0], "standard": costs[1], "premium": costs[2]},
        "nearest_railway": train,
        "nearest_airport": air,
        "attractions": [
            {"name": top_attr, "fee": 50, "timeNeeded": "3 hrs", "category": cat[0], "description": f"Must-visit landmark in {name} offering unique local experiences."},
            {"name": f"{name} Heritage Promenade", "fee": 0, "timeNeeded": "2 hrs", "category": "Sightseeing", "description": "Picturesque spot showcasing local architecture and vistas."},
            {"name": f"{name} Sunset Point & Local Market", "fee": 0, "timeNeeded": "2 hrs", "category": "Shopping", "description": "Vibrant market for authentic regional souvenirs and sunset views."},
            {"name": f"{name} Cultural Museum & Temple", "fee": 30, "timeNeeded": "1.5 hrs", "category": "Culture", "description": "Centuries-old historic site depicting the region's rich traditions."}
        ],
        "local_foods": [
            {"name": food, "desc": f"Famous signature specialty of {name}", "price": 180, "veg": True},
            {"name": f"{name} Traditional Special Thali", "desc": "Authentic multi-course meal with seasonal ingredients", "price": 250, "veg": True}
        ],
        "local_transport": [
            {"mode": "Local Auto / E-Rickshaw", "costPerDay": 350, "desc": f"Convenient for exploring {name} city center", "icon": "auto"},
            {"mode": "Private Tourist Cab", "costPerDay": 1500, "desc": "Dedicated sightseeing with driver", "icon": "car"}
        ],
        "hotels": {
            "budget": {"name": f"Zostel / Backpacker Inn {name}", "pricePerNight": int(costs[0] * 0.6), "rating": 4.5, "amenities": ["WiFi", "Clean Beds", "Lounge"]},
            "standard": {"name": f"Heritage Grand / Sarovar {name}", "pricePerNight": int(costs[1] * 0.95), "rating": 4.7, "amenities": ["AC Room", "Breakfast", "Pool"]},
            "luxury": {"name": f"Taj / Oberoi Palace {name}", "pricePerNight": int(costs[2] * 1.5), "rating": 4.93, "amenities": ["Palace Luxury", "Spa", "Fine Dining"]}
        },
        "activities": [
            {"id": f"act_{d_id}_sightseeing", "name": f"Highlights of {name} Guided Tour", "duration": "3 hrs", "price": 750, "tier": "budget", "category": "Sightseeing", "desc": f"Explore iconic monuments and viewpoints in {name} with a storyteller."},
            {"id": f"act_{d_id}_adventure", "name": f"Signature Adventure Experience in {name}", "duration": "2.5 hrs", "price": 1400, "tier": "standard", "category": "Adventure", "desc": "Exciting outdoor activity tailored to the local geography."}
        ],
        "rating": rating,
        "popularity_score": pop,
        "image_url": img,
        "emergency": {"police": "112", "hospital": "108 (District Civil Hospital)", "ambulance": "108", "touristHelpline": "1363"},
        "eco_score": "A"
    }
    destinations.append(dest)

transportRoutes = [
    {
        "from": "Pune",
        "to": "Goa",
        "trains": [
            {"name": "Goa Express (12780)", "number": "12780", "dep": "16:35", "arr": "05:40", "duration": "13h 05m", "classes": {"sleeper": 420, "3ac": 1120, "2ac": 1610, "1ac": 2720}},
            {"name": "Vande Bharat Express (20670)", "number": "20670", "dep": "05:45", "arr": "13:30", "duration": "7h 45m", "classes": {"cc": 1350, "ec": 2550}},
            {"name": "Poorva Express (Special)", "number": "01423", "dep": "18:45", "arr": "07:15", "duration": "12h 30m", "classes": {"sleeper": 390, "3ac": 1050, "2ac": 1500}}
        ],
        "buses": [
            {"operator": "IntrCity SmartBus AC Sleeper", "dep": "21:00", "arr": "07:30", "price": 1100, "rating": 4.7},
            {"operator": "Zingbus Electric Luxury Sleeper", "dep": "22:15", "arr": "08:45", "price": 950, "rating": 4.6},
            {"operator": "KSRTC Airavat Club Class", "dep": "20:30", "arr": "07:00", "price": 1250, "rating": 4.8}
        ],
        "flights": [
            {"airline": "IndiGo (6E-614)", "dep": "08:15", "arr": "09:20", "duration": "1h 05m", "price": 3400},
            {"airline": "Air India Express (IX-841)", "dep": "14:10", "arr": "15:20", "duration": "1h 10m", "price": 3150},
            {"airline": "Akasa Air (QP-1352)", "dep": "19:40", "arr": "20:45", "duration": "1h 05m", "price": 2980}
        ],
        "cabs": [
            {"type": "Sedan (Dzire / Etios)", "price": 8500, "time": "9 hrs"},
            {"type": "SUV (Ertiga / Innova)", "price": 12000, "time": "8.5 hrs"}
        ]
    },
    {
        "from": "Mumbai",
        "to": "Delhi",
        "trains": [
            {"name": "Mumbai Rajdhani Express (12951)", "number": "12951", "dep": "17:00", "arr": "08:32", "duration": "15h 32m", "classes": {"3ac": 2350, "2ac": 3390, "1ac": 4850}},
            {"name": "August Kranti Rajdhani (12953)", "number": "12953", "dep": "17:10", "arr": "09:43", "duration": "16h 33m", "classes": {"3ac": 2240, "2ac": 3280, "1ac": 4720}}
        ],
        "flights": [
            {"airline": "Air India (AI-806)", "dep": "07:00", "arr": "09:15", "duration": "2h 15m", "price": 4200},
            {"airline": "IndiGo (6E-2054)", "dep": "11:30", "arr": "13:45", "duration": "2h 15m", "price": 3890}
        ]
    },
    {
        "from": "Delhi",
        "to": "Jaipur",
        "trains": [
            {"name": "Ajmer Vande Bharat (20978)", "number": "20978", "dep": "06:10", "arr": "09:55", "duration": "3h 45m", "classes": {"cc": 880, "ec": 1650}},
            {"name": "New Delhi Shatabdi (12015)", "number": "12015", "dep": "06:10", "arr": "10:40", "duration": "4h 30m", "classes": {"cc": 740, "ec": 1420}}
        ],
        "buses": [
            {"operator": "RSRTC Volvo Super Luxury", "dep": "07:00", "arr": "12:00", "price": 650, "rating": 4.7}
        ]
    }
]

# Write destinations.json
with open('data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2)

# Write js/data.js
js_code = f"""// Global fallback & offline dataset for TripSmart
(function() {{
  window.TRIPSMART_DESTINATIONS = {json.dumps(destinations, indent=2)};
  window.TRIPSMART_ROUTES = {json.dumps(transportRoutes, indent=2)};
  console.log("TripSmart dataset initialized with " + window.TRIPSMART_DESTINATIONS.length + " destinations.");
}})();
"""

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"Successfully generated {len(destinations)} destinations in data/destinations.json and js/data.js")

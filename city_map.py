import folium
from folium.plugins import MarkerCluster

# Create a map centered on China
m = folium.Map(location=[35.0, 105.0], zoom_start=4)

# Create marker clusters for Chinese and European cities
china_cluster = MarkerCluster(name='Chinese Cities').add_to(m)
europe_cluster = MarkerCluster(name='European Cities').add_to(m)

# Chinese cities
china_cities = [
    ("北京", 39.9042, 116.4074),
    ("拉萨", 29.6548, 91.1406),
    ("林芝", 29.6540, 94.3612),
    ("日喀则", 29.2667, 88.8833),
    ("丽江", 26.8550, 100.2278),
    ("昆明", 24.8801, 102.8329),
    ("成都", 30.5728, 104.0668),
    ("重庆", 29.5630, 106.5516),
    ("天津", 39.0842, 117.2010),
    ("杭州", 30.2741, 120.1551),
    ("无锡", 31.4907, 120.3123),
    ("上海", 31.2304, 121.4737),
    ("洛阳", 34.6836, 112.4546),
    ("兰州", 36.0611, 103.8343),
    ("甘南藏族自治州（合作市）", 34.9996, 102.9094)
]

# European cities
europe_cities = [
    ("伦敦", 51.5074, -0.1278, "英国"),
    ("格拉斯哥", 55.8642, -4.2518, "英国"),
    ("爱丁堡", 55.9533, -3.1883, "英国"),
    ("约克", 53.9590, -1.0815, "英国"),
    ("利兹", 53.8008, -1.5491, "英国"),
    ("巴黎", 48.8566, 2.3522, "法国"),
    ("罗马", 41.9028, 12.4964, "意大利"),
    ("佛罗伦萨", 43.7696, 11.2558, "意大利"),
    ("威尼斯", 45.4408, 12.3155, "意大利"),
    ("布拉格", 50.0755, 14.4378, "捷克"),
    ("维也纳", 48.2082, 16.3738, "奥地利"),
    ("布达佩斯", 47.4979, 19.0402, "匈牙利"),
    ("巴塞罗那", 41.3851, 2.1734, "西班牙"),
    ("塞维利亚", 37.3891, -5.9845, "西班牙"),
    ("格拉纳达", 37.1773, -3.5986, "西班牙"),
    ("里斯本", 38.7223, -9.1393, "葡萄牙"),
    ("波尔图", 41.1579, -8.6291, "葡萄牙"),
    ("雷克雅未克", 64.1466, -21.9426, "冰岛"),
    ("特罗姆瑟", 69.6496, 18.9553, "挪威"),
    ("罗瓦涅米", 66.5039, 25.7294, "芬兰"),
    ("赫尔辛基", 60.1699, 24.9384, "芬兰")
]

# Add Chinese cities to the map
for city, lat, lon in china_cities:
    folium.Marker(
        location=[lat, lon],
        popup=city,
        icon=folium.Icon(color='red', icon='info-sign')
    ).add_to(china_cluster)

# Add European cities to the map
for city, lat, lon, country in europe_cities:
    folium.Marker(
        location=[lat, lon],
        popup=f"{city} ({country})",
        icon=folium.Icon(color='blue', icon='info-sign')
    ).add_to(europe_cluster)

# Add layer control
folium.LayerControl().add_to(m)

# Save the map
m.save('cities_map.html') 
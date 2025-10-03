import requests
import json
api_key = "2558325ef979ea39e0f540d75eabc37c"
city_name = input("Enter your city: ")

# Fetch city coordinates from the first request
url = f"https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}"
req = requests.get(url)
data = req.json()

lat = data['coord']['lat'] 
lon = data['coord']['lon'] 

# Use the onecall API to get the daily forecast
exclude = "minutely,hourly"
url_weekly = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}"
req_weekly = requests.get(url_weekly)
data_weekly = req_weekly.json()

days = []
nights = []
descriptions = []

# Collect weather data
for item in data_weekly['list']:
    temp = item['main']['temp']
    temp = float(temp)
    days.append(round(temp - 273.15, 2))
    nights.append(round(temp - 273.15, 2))
    descriptions.append(item['weather'][0]['main'] + ": " + item['weather'][0]['description'])

# Format the output
weather_data = f'[ {city_name} - 7 days forecast]\n'
for i in range(len(days)):
    weather_data += f'\nDay {i+1}\n'
    weather_data += f'Daytime: {days[i]}°C\n'
    weather_data += f'Nighttime: {nights[i]}°C\n'
    weather_data += f'Conditions: {descriptions[i]}\n'
print(weather_data)
# Serializing json
json_object = json.dumps(data_weekly, indent=4)

# Writing to sample.json
with open("sample.json", "w") as outfile:
	outfile.write(json_object)



# import requests
# api_key = "2558325ef979ea39e0f540d75eabc37c"
# city_name = input("Enter your city: ")
# days = []
# nights = []
# descriptions = []
# url = f"https://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={api_key}"
# req = requests.get(url)
# data = req.json()
# # print(data)
# lat = input("Enter yout lat: ") # data['coord']['lat'] 
# lon = input("Enter yout lon: ") # data['coord']['lon'] 
# exclude = "minutely,hourly"
# url_weekly = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&exclude={exclude}&appid={api_key}"
# req_weekly = requests.get(url)
# data_weekly = req_weekly.json()
# # print(data_weekly)
# for i in data_weekly['daily']:
#     days.append(round(i['temp']['day'] - 273.15, 2))
#     nights.append(round(i['temp']['night'] - 273.15, 2))
#     descriptions.append(round(i['weather'][0]['main'] + ": " + i['weather'][0]['description']))
# weather_data = f'[ {city_name} - 8 days forecast]\n'
# for i in range(len(days)):
#     if i != len(days):
#         weather_data = f'\nDay {i+1}\n'
#     weather_data += f'Morning: {days[i]} C\n'
#     weather_data += f'Night: {nights[i]} C\n'
#     weather_data += f'Conditions: {descriptions[i]} \n'
# print(weather_data)

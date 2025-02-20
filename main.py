import requests
import datetime
import time
import csv
import sys

headers = {
	'origin': 'https://resy.com',
	'accept-encoding': 'gzip, deflate, br',
	'x-origin': 'https://resy.com',
	'accept-language': 'en-US,en;q=0.9',
	'authorization': 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
	'Cache-Control': 'no-cache',
	'content-type': 'application/x-www-form-urlencoded',
	'accept': 'application/json, text/plain, */*',
	'referer': 'https://resy.com/',
	'authority': 'api.resy.com',
	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
}

def login(username, password):
	data = {
		'email': username,
		'password': password
	}

	response = requests.post('https://api.resy.com/3/auth/password', headers=headers, data=data)
	res_data = response.json()

	auth_token = res_data['token']
	payment_method_string = '{"id":' + str(res_data['payment_method_id']) + '}'
	return auth_token, payment_method_string

def find_table(res_date, party_size, table_time, auth_token, venue_id):
	# convert datetime to string
	day = res_date.strftime('%Y-%m-%d')
	print(venue_id)
	params = (
		#('x-resy-auth-token',  auth_token),
		('day', day),
		('lat', '0'),
		('long', '0'),
		('party_size', str(party_size)),
		('venue_id', str(venue_id)),
	)
	headers2 = {
    'Authorization': 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
    'Cache-Control': 'no-cache',
	}
	response = requests.get('https://api.resy.com/4/find', headers=headers2, params=params)
	
	data = response.json()
	results = data['results']
	print("results", results)
	if len(results['venues']) > 0:
		open_slots = results['venues'][0]['slots']
		if len(open_slots) > 0:
			available_times = [(k['date']['start'], datetime.datetime.strptime(k['date']['start'], "%Y-%m-%d %H:%M:00").hour) for k in open_slots]
			closest_time = min(available_times, key=lambda x:abs(x[1]-table_time))[0]
			# can modify this so that we return all the tables within a certain time range from requested
			best_table = [k for k in open_slots if k['date']['start'] == closest_time][0]
			
			return best_table

def try_table(day, party_size, table_time, auth_token, restaurant):
	best_table = find_table(day, party_size, table_time, auth_token, restaurant)
	print("best table", best_table)

def readconfig():
	dat = open('requests.config').read().split('\n')
	return [k.split(':')[1] for k in dat]

def main():
	username, password, venue, date, guests = readconfig()
	auth_token, payment_method_string = login(username, password)
	print('logged in succesfully - disown this task and allow it to run in the background')
	party_size = int(guests)
	table_time = 20
	day = datetime.datetime.strptime(date,'%m/%d/%Y')
	restaurant = int(venue)

	reserved = 0
	while reserved == 0:
		reserved = try_table(day, party_size, table_time, auth_token, restaurant)

main()

import requests

headers = {
    'authority': 'api.resy.com',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
    'x-origin': 'https://resy.com',
    'sec-ch-ua-mobile': '?0',
    'authorization': 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
    'accept': 'application/json, text/plain, */*',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
    'cache-control': 'no-cache',
    'sec-ch-ua-platform': '"Windows"',
    'origin': 'https://resy.com',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://resy.com/',
    'accept-language': 'en-US,en;q=0.9',
}

params = (
    ('location_id', 'bos'),
    ('collection_id', '1024'),
    ('day', '2022-03-07'),
    ('party_size', '2'),
    ('limit', '20'),
    ('offset', '1'),
    ('finder', '4'),
)

response = requests.get('https://api.resy.com/3/collection/venues', headers=headers, params=params)
dat = response.json()
venues = dat['results']['venues']
for v in venues:
    print(v['venue']['name'],v['venue']['id']['resy'])
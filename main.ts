import axios from 'axios'
import * as fs from 'fs'
import { FindResponse, Venue, Slot } from './interfaces'

const headers = {
  authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
  'Cache-Control': 'no-cache',
}

async function findTable(
  res_date: Date,
  party_size: number,
  table_time: number,
  venue_id: number
): Promise<any> {
  const day = res_date.toISOString().split('T')[0]
  const params = {
    day,
    lat: '0',
    long: '0',
    party_size: String(party_size),
    location: 'ny',
    limit: String(2),
    offset: String(0),
    //venue_id: String(venue_id),
  }
  console.log('Finding table...')

  // Send GET request to retrieve reservation results
  const response = await axios.get<FindResponse>(
    'https://api.resy.com/3/venues/book_tonight',
    { headers: headers, params }
  )
  const data = response.data
  //console.log('query', response.data)
  const results = data.results

  /*
  // Convert the data to JSON format
  const jsonData = JSON.stringify(results, null, 2)

  // Specify the file path where you want to write the JSON file
  const filePath = './output.json'

  // Write the JSON data to the file
  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing the JSON file:', err)
      return
    }
    console.log('JSON file has been written successfully!')
  })*/

  if (results.venues.length > 0) {
    const open_slots = results.venues[0].slots

    //console.log('everything', results.venues[0])
    //console.log('open slots', open_slots)

    let restaurants = results.venues.map((restaurant) => {
      const filteredSlots = restaurant.slots.reduce((result, slot) => {
        const startHours = new Date(slot.date.start).getHours()
        const startMinutes = new Date(slot.date.start).getMinutes()
        const slotTime = startHours + startMinutes / 60
        const timeDifference = Math.abs(slotTime - table_time)

        // Filter for time slots that are within 30 minutes of selected time
        if (timeDifference <= 0.5) {
          result.push({
            startTime: slot.date.start,
            roomType: slot.config.type,
            token: slot.config.token,
          })
        }

        return result
      }, [])

      //console.log('filtered slots', filteredSlots)

      return {
        restaurantID: restaurant.venue.id.resy,
        restaurantName: restaurant.venue.name,
        restaurantDescription: restaurant.venue.content[0].body,
        restaurantType: restaurant.venue.type,
        priceRange: restaurant.venue.price_range,
        rating: parseFloat(restaurant.venue.rating).toFixed(2),
        neighborhood: restaurant.venue.location.neighborhood,
        times: filteredSlots,
      }
    })

    console.log('restaurants', JSON.stringify(restaurants))
  }
  // TO BE UPDATED
  return null
}

// pulls the venue, date, and guests requested
function readConfig(): [string, string, string] {
  const fs = require('fs')
  const formInput = fs.readFileSync('requests.config', 'utf8').split('\n')
  return formInput.map((k) => k.split(':')[1].trim()) as [
    string,
    string,
    string
  ]
}

async function main() {
  const [venue, date, guests] = readConfig()
  console.log(venue)
  console.log(date)
  console.log(guests)

  try {
    const party_size = parseInt(guests, 10)
    const table_time = 20.0
    const day = new Date(date)
    const restaurant = parseInt(venue, 10)

    await findTable(day, party_size, table_time, restaurant)
  } catch (error) {
    console.error('Error:', error)
  }
}

main()

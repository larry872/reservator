interface TimeDetails {
  startTime: string
  roomType: string
  token: string
}

interface Restaurant {
  restaurantID: string
  restaurantName: string
  restaurantDescription: string
  restaurantType: string
  priceRange: number
  rating: string
  neighborhood: string
  timeSlots: TimeDetails[]
}

function generateReservationURLs(restaurant: Restaurant): string[] {
  const { restaurantID, timeSlots } = restaurant

  // iterate through all the timeslots available for a given restaurant to generate the required URLs
  const reservationURLs = timeSlots.reduce((results, timeSlot) => {
    const encodedStartTime = encodeURI(timeSlot.startTime)
    const encodedRoomType = encodeURI(timeSlot.roomType)
    const encodedToken = encodeURIComponent(timeSlot.token)
    const date = timeSlot.startTime.split(' ')[0]
    const seats = 5
    const reservationParam = `reservation=%7B%22type%22:%22${encodedRoomType}%22,%22token%22:%22${encodedToken}%22,%22time%22:%22${encodedStartTime}%22`
    const url = `https://widgets.resy.com/?venueId=${restaurantID}#/reservation-details?${reservationParam}%7D&date=${date}&seats=${seats}`
    results.push(url)

    return results
  }, [])

  return reservationURLs

  /* 
  const encodedStartTime = encodeURI(timeSlots[0].startTime)
  const encodedRoomType = encodeURI(timeSlots[0].roomType)
  const encodedToken = encodeURIComponent(timeSlots[0].token)
  const date = timeSlots[0].startTime.split(' ')[0]

  const reservationParam = `reservation=%7B%22type%22:%22${encodedRoomType}%22,%22token%22:%22${encodedToken}%22,%22time%22:%22${encodedStartTime}%22`
  const seats = 5

  const url = `https://widgets.resy.com/?venueId=${restaurantID}#/reservation-details?${reservationParam}%7D&date=${date}&seats=${seats}`
  
  return url */
}

// Example usage
const restaurant: Restaurant = {
  restaurantName: 'Beekman',
  restaurantDescription: 'test',
  restaurantID: '40703',
  timeSlots: [
    {
      startTime: '2023-06-30 19:30:00',
      roomType: 'The Bar Room',
      token:
        'rgs://resy/40703/1484236/2/2023-06-30/2023-06-30/19:30:00/2/The Bar Room',
    },
  ],
  restaurantType: '',
  priceRange: 0,
  rating: '',
  neighborhood: '',
}

const reservationURL = generateReservationURLs(restaurant)
console.log(reservationURL)

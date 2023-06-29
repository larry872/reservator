// Interfaces associated with Resy's public API

// Each result contains a list of venues
export interface FindResponse {
  results: {
    venues: Venue[]
  }
}

// Each item in venues list contains information about the venue
// and a slots list that lists out the available timeslots at that venue
export interface Venue {
  slots: Slot[]
  venue: {
    id: {
      resy: number
    }
    name: string
    type: string
    price_range: number
    rating: string
    location: {
      neighborhood: string
    }
    content: {
      body: string
    }
  }
}

// each item in the slots list is an available time slot at that restaurant
// the object has data about reservation start time, room type (e.g.outdoor/indoor/bar), and a specific
// reservation token
export interface Slot {
  date: {
    start: string
  }
  config: {
    type: string
    token: string
  }
}

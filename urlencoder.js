function generateReservationURLs(restaurant) {
    var restaurantID = restaurant.restaurantID, timeSlots = restaurant.timeSlots;
    var reservationParams = timeSlots.reduce(function (results, timeSlot) {
        var encodedStartTime = encodeURI(timeSlot.startTime);
        var encodedRoomType = encodeURI(timeSlot.roomType);
        var encodedToken = encodeURIComponent(timeSlot.token);
        var date = timeSlot.startTime.split(' ')[0];
        var seats = 5;
        var reservationParam = "reservation=%7B%22type%22:%22".concat(encodedRoomType, "%22,%22token%22:%22").concat(encodedToken, "%22,%22time%22:%22").concat(encodedStartTime, "%22");
        var url = "https://widgets.resy.com/?venueId=".concat(restaurantID, "#/reservation-details?").concat(reservationParam, "%7D&date=").concat(date, "&seats=").concat(seats);
        results.push(url);
        return results;
    }, []);
    return reservationParams;
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
var restaurant = {
    restaurantName: 'Beekman',
    restaurantDescription: 'test',
    restaurantID: '40703',
    timeSlots: [
        {
            startTime: '2023-06-30 19:30:00',
            roomType: 'The Bar Room',
            token: 'rgs://resy/40703/1484236/2/2023-06-30/2023-06-30/19:30:00/2/The Bar Room',
        },
    ],
    restaurantType: '',
    priceRange: 0,
    rating: '',
    neighborhood: '',
};
var reservationURL = generateReservationURLs(restaurant);
console.log(reservationURL);

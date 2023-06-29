"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var headers = {
    authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
    'Cache-Control': 'no-cache',
};
function findTable(res_date, party_size, table_time, venue_id) {
    return __awaiter(this, void 0, void 0, function () {
        var day, params, response, data, results, open_slots, restaurants;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    day = res_date.toISOString().split('T')[0];
                    params = {
                        day: day,
                        lat: '0',
                        long: '0',
                        party_size: String(party_size),
                        location: 'ny',
                        limit: String(2),
                        offset: String(0),
                        //venue_id: String(venue_id),
                    };
                    console.log('Finding table...');
                    return [4 /*yield*/, axios_1.default.get('https://api.resy.com/3/venues/book_tonight', { headers: headers, params: params })];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    results = data.results;
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
                        open_slots = results.venues[0].slots;
                        restaurants = results.venues.map(function (restaurant) {
                            var filteredSlots = restaurant.slots.reduce(function (result, slot) {
                                var startHours = new Date(slot.date.start).getHours();
                                var startMinutes = new Date(slot.date.start).getMinutes();
                                var slotTime = startHours + startMinutes / 60;
                                var timeDifference = Math.abs(slotTime - table_time);
                                // Filter for time slots that are within 30 minutes of selected time
                                if (timeDifference <= 0.5) {
                                    result.push({
                                        startTime: slot.date.start,
                                        roomType: slot.config.type,
                                        token: slot.config.token,
                                    });
                                }
                                return result;
                            }, []);
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
                            };
                        });
                        console.log('restaurants', JSON.stringify(restaurants));
                    }
                    // TO BE UPDATED
                    return [2 /*return*/, null];
            }
        });
    });
}
// pulls the venue, date, and guests requested
function readConfig() {
    var fs = require('fs');
    var formInput = fs.readFileSync('requests.config', 'utf8').split('\n');
    return formInput.map(function (k) { return k.split(':')[1].trim(); });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, venue, date, guests, party_size, table_time, day, restaurant, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = readConfig(), venue = _a[0], date = _a[1], guests = _a[2];
                    console.log(venue);
                    console.log(date);
                    console.log(guests);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    party_size = parseInt(guests, 10);
                    table_time = 20.0;
                    day = new Date(date);
                    restaurant = parseInt(venue, 10);
                    return [4 /*yield*/, findTable(day, party_size, table_time, restaurant)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();

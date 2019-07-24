const { google } = require('googleapis')
require('dotenv').config()
const config = require('config')
const googleEmail = config.get('google.email')
const googleKey = config.get('google.key')
const scopes = 'https://www.googleapis.com/auth/calendar'
const jwt = new google.auth.JWT(googleEmail, null, googleKey.replace(/\\n/g, '\n'), scopes)

const calendar = google.calendar({
  version: 'v3',
  auth: jwt
})

// delete calendars
// calendar.calendarList.list({ }, (error, response) => {
// 	if (error) console.log(error);
// 	response.data.items.forEach( cal => {
// 		calendar.calendars.delete({calendarId: cal.id}, (err,resp)=>{
// 			if (err) console.log(err);
// 			console.log(`Deleted calendar with id ${cal.id} `)
// 		})
// 	});
// })

// show calendars
// calendar.calendarList.list({ }, (error, response) => {
// 	if (error) console.log(error);
// 	response.data.items.forEach( cal => {
// 		console.log(cal)
// 	});
// })

// delete events from calendar
// calendar.calendarList.list({ }, (error, response) => {
// 	if (error) console.log(error);
// 	response.data.items.forEach( cal => {
// 		calendar.events.list({calendarId: cal.id},(err,resp)=>{
// 			if (err) console.log(err);
// 			resp.data.items.forEach( event => {
// 				calendar.events.delete({eventId: event.id, calendarId: cal.id}, (er, res)=>{
// 					if(er) console.log(er)
// 					console.log("deleted event with id "+event.id)
// 				})
// 			})
// 		})
// 	});
// })

// Patch All evens
// calendar.calendarList.list({ }, async (error, response) => {
// 	if (error) console.log(error);
// 	for (const cal of response.data.items) {
// 		calendar.events.list({ calendarId: cal.id }, async (err, resp) => {
// 			if (err) console.log(err)
// 			resp.data.items.forEach( item => {
// 				const timeslotPatch = {
// 					extendedProperties: {
// 						shared: {
// 							parents: JSON.stringify([]),
// 							children: JSON.stringify([])
// 						}
// 					}
// 				}
// 				calendar.events.patch({ calendarId: cal.id, eventId: item.id, resource: timeslotPatch })
// 			})
// 		})
// 	}
// })
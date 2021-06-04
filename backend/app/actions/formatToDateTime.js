const moment = require('moment-timezone')
/**
  * Format the date and time into a datetime field
  * @param {String} time
  * @param {String} date
  * @param {String} timezone
  * @returns new Date()
  */
const formatToDateTime = (time, date, timezone = 'Africa/Nairobi') => {
  if (!time) {
    time = '00:00'
  }
  if (!date) {
    return
  }
  /** Format the date */
  const timeArray = time.split(':')
  const dateArray = date.split('-')
  const dateTime = new Date() // New date instance
  dateTime.setHours(timeArray[0]) // Set the hours from the input
  dateTime.setMinutes(timeArray[1]) // set the minutes from the input
  dateTime.setSeconds(0) // Seconds should always be zero
  dateTime.setFullYear(dateArray[0]) // set the year
  dateTime.setMonth(dateArray[1] - 1) // the month -1
  dateTime.setDate(dateArray[2]) // The day of the month
  const t = moment(dateTime, true).tz(timezone, true).toDate()
  return t
}

module.exports = formatToDateTime

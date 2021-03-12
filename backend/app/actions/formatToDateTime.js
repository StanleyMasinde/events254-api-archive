const moment = require('moment-timezone')
/**
  * Format the date and time into a datetime field
  * @param {String} fromTime
  * @param {String} fromDate
  * @param {String} timezone
  * @returns new Date()
  */
const formatToDateTime = (fromTime, fromDate, timezone = 'Africa/Nairobi') => {
  /** Format the date */
  const fromTimeArray = fromTime.split(':')
  const fromDateArray = fromDate.split('-')
  const fromDateTime = new Date() // New date instance
  fromDateTime.setHours(fromTimeArray[0]) // Set the hours from the input
  fromDateTime.setMinutes(fromTimeArray[1]) // set the minutes from the input
  fromDateTime.setSeconds(0) // Seconds should always be zero
  fromDateTime.setFullYear(fromDateArray[0]) // set the year
  fromDateTime.setMonth(fromDateArray[1] - 1) // the month -1
  fromDateTime.setDate(fromDateArray[2]) // The day of the month
  const t = moment(fromDateTime, true).tz(timezone, true).toDate()
  return t
}

module.exports = formatToDateTime

const fs = require('fs')
const PDFDocument = require('pdfkit')
const doc = new PDFDocument()
const moment = require('moment-timezone')

class PDF {
  /**
     * Create a new PDF document to attach to emails.
     * This is primarily meant for tickets
     * @param {*} data
     */
  constructor (data = {}) {
    this.data = data
  }

  /**
   * Render the PDF as a readable blob.
   * It is good when you want to attach to email
   */
  createTicket () {
    // doc.text(this.data)
    doc.font('Courier')
    doc.lineCap('round')
      .lineWidth(0.4)
      .moveTo(45, 45)
      .lineTo(45, 250)
      .lineTo(557, 250)
      .lineTo(557, 45)
      .lineTo(45, 45)
      .stroke('gray')
    doc.lineCap('round')
      .moveTo(45, 45)
      .lineTo(45, 90)
      .lineTo(557, 90)
      .lineTo(557, 45)
      .lineTo(45, 45)
      .fillAndStroke('#04473f', 'gray')
    doc
      // .image('./public/icon.png', 50, 45, { width: 50 })
      .fillColor('white')
      .fontSize(12)
      .text('This is your ticket', 50, 57)
      .fontSize(7)
      .text('Show this at the event', 50, 70)
      .fontSize(15)
      .text('Events254', 200, 50, { align: 'right' })
      .moveDown()
    doc
      .fillColor('black')
      .fontSize(8)
      .text('Organiser name', 50, 100)
      .fontSize(18)
      .text(`${this.data.currentEvent.about}`, 50, 110)
      .fontSize(8)
      .text(`Venue: ${this.data.currentEvent.location}`, 50, 130)
      .fontSize(10)
      .text(moment(this.data.currentEvent.startDate).tz('Africa/Nairobi').toString(), 50, 145) // TODO add the timezone to user Object
      .fontSize(11)
      .font('Courier-Bold')
      .text('Issued to', 50, 190)
      .text('Order number', 120, 190)
      .text('Ticket', 215, 190)
      .fontSize(8)
      .font('Courier')
      .text(this.data.name, 50, 205)
      .text(`#EV254KE${this.data.ticketId}`, 120, 205)
      .text(this.data.currentTicket.type, 215, 205)
      .text(this.data.currentTicket.price === 0 ? 'Free' : Intl.NumberFormat('en-US', { style: 'currency', currency: 'kes' }).format(this.data.currentTicket.price))
      .moveDown()
      .save()
    doc.pipe(fs.createWriteStream(`uploads/EV254KE${this.data.ticketId}.pdf`))
    doc.end()
    return doc
  }
}

module.exports = PDF

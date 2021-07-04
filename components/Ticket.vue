<template>
  <!-- Ticket with QRCode, event organiser, date, time, price, location, and description -->
  <div class="ticket">
    <!-- <div class="ticket-image">
      <img
        :src="ticket.image"
        alt="Ticket Image"
      >
    </div> -->
    <div class="ticket-info">
      <div class="ticket-title">
        <h3>{{ ticket.ticketType }}</h3>
      </div>
      <div class="ticket-description">
        <p>{{ ticket.eventName }}</p>
      </div>
      <div class="ticket-price">
        <h3>Price:</h3>
        <h4>
          {{
            Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "kes",
            }).format(ticket.ticketPrice)
          }}
        </h4>
      </div>
      <div class="ticket-location">
        <h3>Location:</h3>
        <h4>{{ ticket.eventLocation }}</h4>
      </div>
      <div class="ticket-organiser">
        <h3>Organiser:</h3>
        <h4>{{ ticket.organiser.name }}</h4>
      </div>
      <div class="ticket-date">
        <h3>Date:</h3>
        <h4>12/12/2016</h4>
      </div>
      <div class="ticket-time">
        <h3>Time:</h3>
        <h4>12:00 PM</h4>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Ticket',
  props: {
    ticket: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
// Ticket with QRCode, event organiser, date, time, price, location, and description
.ticket {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
}
.ticket-image {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
}
.ticket-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
}
.ticket-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
}
.ticket-title h3 {
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
}
.ticket-description {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
}
.ticket-description p {
  font-size: 1.2em;
  color: #000;
}
.ticket-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
}
.ticket-price h3 {
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
}
.ticket-price h4 {
  font-size: 1.2em;
  color: #000;
}
.ticket-location {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
}
.ticket-location h3 {
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
}
.ticket-location h4 {
  font-size: 1.2em;
  color: #000;
}
.ticket-organiser {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
}
.ticket-organiser h3 {
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
}
.ticket-organiser h4 {
  font-size: 1.2em;
  color: #000;
}
.ticket-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
}
.ticket-date h3 {
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
}
.ticket-date h4 {
  font-size: 1.2em;
  color: #000;
}
.ticket-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
}

.ticket-time h3 {
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
}

.ticket-time h4 {
  font-size: 1.2em;
  color: #000;
}
</style>

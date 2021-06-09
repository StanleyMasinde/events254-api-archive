<template>
  <div class="scroll">
    <div class="ticket">
      <div class="ticket-content-wrapper">
        <div class="left">
          <div class="event-title">
            <h3 class="name">
              {{ ticket.eventName }}
            </h3>
          </div>
          <div class="ticket-count-grids">
            <div class="ticket-grid-item">
              Tickets
            </div>
            <div class="ticket-grid-item">
              Type
            </div>
            <div class="ticket-grid-item">
              Price
            </div>
            <div class="ticket-grid-item">
              {{ ticket.ticketCount }}
            </div>
            <div class="ticket-grid-item">
              {{ ticket.ticketType }}
            </div>
            <div class="ticket-grid-item">
              {{ Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "kes",
              }).format(ticket.ticketPrice) }}
            </div>
          </div>
          <div class="ticket-grids">
            <div class="ticket-grid-item">
              When: {{ $moment(ticket.eventDate).format("dddd Do MMMM YYYY [at] h:mm a") }}
            </div>
            <div class="ticket-grid-item">
              Where: {{ ticket.eventLocation }}
            </div>
            <div class="ticket-grid-item">
              Issued to: Stanley Masinde
            </div>
            <div class="ticket-grid-item">
              Hosted by: Opensource254
            </div>
          </div>
        </div>
        <div class="right">
          <p class="ticket-number">
            Nō 000{{ ticket.ticketId }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ticket: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped>
div.ticket-content-wrapper {
  background: #000;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  display: grid;
  grid-template-columns: 500px 150px;
}
.event-title {
  text-align: center;
  white-space: normal;
  padding-top: 5px;
}

.ticket-count-grids {
   display: grid;
  padding-left: 3px;
  font-size: 18px;
  grid-template-columns: auto auto auto;
  grid-template-rows: 30px 30px;
}

.ticket-grids {
  display: grid;
  padding-left: 3px;
  font-size: 18px;
  grid-template-columns: auto auto;
  grid-template-rows: 30px 30px;
  place-items: end;
}

.right {
  border-left: 3px dashed white;
  display: grid;
  place-items: center;
}

.ticket-number {
  transform: rotate(90deg);
  font-weight: 900;
  font-size: x-large;
}

.scroll {
  width: 100%;
  overflow: scroll;
  background-color: #ffffffa8;
}

.name {
  font-weight: 700;
  font-size: x-large;
}

.ticket {
  width: 650px;
  height: 320px;
  margin: 100px auto;
  position: relative;
  transition: all 300ms cubic-bezier(0.03, 0.98, 0.53, 0.99) 0s;
  background: linear-gradient(
    to right,
    #d25778,
    #ec585c,
    #e7d155,
    #56a8c6
  );
  border-radius: 20px;
  padding: 5px;
}

.ticket:before,
.ticket:after {
  content: '';
  display: block;
  position: absolute;
  top: 130px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  z-index: 2;
  background-color: #ffffff;
}

.ticket:before {
  border: 5px solid #d25778;
  left: -35px;
  clip-path: circle(59% at 100% 50%);
}

.ticket:after {
  border: 5px solid #56a8c6;
  right: -35px;
  clip-path: circle(59% at 0 50%);
}

.ticket-content-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  border-radius: 15px;
}
</style>

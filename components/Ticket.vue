<template>
  <div class="outline">
    <div class="inner-border">
      <div class="ticket-header">
        <p class="event-name">
          {{ ticket.eventName }}
        </p>
        <hr class="line">
        <div class="ticket-body">
          <div class="ticket-body-item">
            <p class="ticket-item-title">
              Tickets
            </p>
            <p class="ticket-item-body">
              {{ ticket.ticketCount }}
            </p>
          </div>
          <div class="ticket-body-item">
            <p class="ticket-item-title">
              Type
            </p>
            <p class="ticket-item-body">
              {{ ticket.ticketType }}
            </p>
          </div>
          <div class="ticket-body-item">
            <p class="ticket-item-title">
              Price
            </p>
            <p class="ticket-item-body">
              {{
                Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "kes",
                }).format(ticket.ticketPrice)
              }}
            </p>
          </div>
        </div>
        <hr class="line">
        <div class="ticket-total">
          <div class="ticket-body-item" />
          <div class="ticket-body-item" />
          <div class="ticket-body-item">
            <p class="ticket-item-title">
              Total:{{
                Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "kes",
                }).format(ticket.ticketPrice * ticket.ticketCount)
              }}
            </p>
          </div>
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
<style lang="scss" scoped>
div {
  font-family: "Courier New", Courier, monospace;
  &.outline {
    width: 100%;
    border: 1px dotted #2c2c2c;
    padding: 13px;
    box-shadow: 0 0 5px #808080;
  }

  &.inner-border {
    border: 2px dashed #474747;
  }

  &.ticket-header {
    text-align: center;
  }

  &.ticket-body {
    display: grid;
    grid-template-areas: "header header header";
  }

  &.ticket-total {
    display: grid;
    grid-template-areas: "header header header";
  }
}

p {
  &.event-name {
    font-weight: bold;
    font-size: 1.6rem;
    text-transform: uppercase;
  }

  &.ticket-item-title {
    font-size: 1.5rem;
    font-weight: 900;
  }

  &.ticket-item-body {
    font-size: 1.3rem;
  }
}
</style>

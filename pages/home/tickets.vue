<template>
  <div>
    <v-row v-if="tickets.length === 0">
      <v-col cols="12">
        <div class="text-center">
          <p class="title">
            You have not bought any tickets
          </p>
          <v-btn to="/" depressed rounded color="primary">
            Look for an event
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-list v-else rounded>
      <v-card v-for="(t,i) in tickets" :key="i" outlined class="mb-3">
        <v-list-item :to="`/tickets/${t.ticketId}`">
          <v-list-item-content class="body-1">
            <v-list-item-title :title="t.eventName">
              <h4>[{{ t.ticketType }}] {{ t.eventName }}</h4>
            </v-list-item-title>
            <v-list-item-subtitle class="red--text">
              {{ $moment(t.eventDate).format("MMMM Do YYYY [at] h:mm a") }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ t.eventLocation }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Ticket price: {{ Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'kes'
              }).format(t.ticketPrice) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-list>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tickets: []
    }
  },
  async fetch () {
    const { data } = await this.$axios.get('/api/auth/tickets')
    this.tickets = data
  }
}
</script>

<template>
  <div>
    <v-list rounded>
      <v-card v-for="(t,i) in tickets" :key="i" outlined rounded="" class="ma-3">
        <v-list-item :to="`/home/tickets/${t.ticketId}`">
          <v-list-item-content>
            <v-list-item-title>
              <h3>[{{ t.ticketType }}] {{ t.eventName }}</h3>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $moment(t.eventDate) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ t.eventLocation }}
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

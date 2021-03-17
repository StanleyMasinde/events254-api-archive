<template>
  <div>
    <div v-if="events.length === 0" class="text-center">
      <p class="title">
        You have not created any events
      </p>
      <v-btn to="/events/create" depressed rounded color="primary">
        Create your first event
      </v-btn>
    </div>
    <!-- A list of events -->
    <v-row v-else>
      <v-col
        v-for="(e,i) in events"
        :key="i"
        cols="12"
        md="6"
      >
        <v-card
          class="ma-5"
          :to="`/events/${e.id}/manage`"
          outlined
        >
          <v-img height="150" :src="e.image" />
          <v-card-text>
            {{ e.about }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      events: []
    }
  },
  async fetch () {
    const { data } = await this.$axios.get('/api/events/currentUser')
    this.events = data
  },
  head () {
    return {
      title: 'My events'
    }
  }
}
</script>

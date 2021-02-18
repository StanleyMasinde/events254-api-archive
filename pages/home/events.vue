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
    <v-card v-for="(e,i) in events" v-else :key="i" outlined class="mb-1">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ e.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ e.description }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>
            Manage
          </v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </v-card>
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

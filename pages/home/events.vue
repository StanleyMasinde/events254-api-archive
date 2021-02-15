<template>
  <div>
    <v-card v-for="(e,i) in events" :key="i" outlined class="mb-1">
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

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mx-auto" flat>
          <v-img :src="currentEvent.poster_url" class="align-end" height="350px">
            <v-card-title>
              <h1 class="custom-shadow white--text">
                {{ currentEvent.title }}
              </h1>
            </v-card-title>
            <v-card-subtitle>
              <h3 class="custom-shadow white--text">
                <v-icon class="white--text">
                  mdi-map-marker
                </v-icon>
                {{ currentEvent.venue || 'To be decided' }}
              </h3>
              <h3 class="custom-shadow white--text">
                <v-icon class="white--text">
                  mdi-calendar
                </v-icon>
                {{ new Date(currentEvent.from).toString() }}
              </h3>
            </v-card-subtitle>
          </v-img>
          <v-card-text class="body-1">
            <h3>About this event</h3>
            {{ currentEvent.description }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon color="primary">
              <v-icon>mdi-share</v-icon>
            </v-btn>
            <v-btn depressed color="primary">
              Register for this event
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      currentEvent: {}
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get(`/api/events/${this.$route.params.event}`)
      this.currentEvent = data
    } catch (error) {
      throw new Error(error)
    }
  }
}
</script>
<style lang="scss">
.custom-shadow {
    text-shadow: 3px 3px 6px black;
}
</style>

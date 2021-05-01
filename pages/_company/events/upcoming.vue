<template>
  <div>
    <v-row v-if="$fetchState.pending" justify="center">
      <h1>Loading</h1>
    </v-row>

    <!-- Something went wrong! 😭 -->
    <v-row v-else-if="$fetchState.error">
      <div class="full-height">
        <v-img height="300" contain src="/not_found.svg">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="8">
                <h1 class="display-1 gray--text">
                  Sorry 😢 There's nothing here
                </h1>
                <v-btn text x-large color="primary" to="/">
                  Go home
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </div>
    </v-row>

    <v-row v-else>
      <v-col v-for="(e, i) in eventsObject" :key="i" cols="12" md="4">
        <v-card
          height="300"
          outlined
          :to="`/events/${e.id}`"
          class="ma-2 no-overflow"
          rounded
        >
          <v-img height="150" class="pa-3" :src="e.image" />
          <v-card-text class="body-2">
            <p class="red--text">
              {{ $moment(e.startDate).format("MMMM Do YYYY [at] h:mm a") }}
            </p>
            <p :title="e.about">
              {{ e.about }} <br>
              <i>{{ $moment(e.startDate).fromNow() }}</i>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="eventsObject.length === 0" cols="12">
        <h1 class="display-1">
          No upcoming events available
        </h1>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      eventsObject: {}
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get(
        `/api/groups/${this.$route.params.company}/events?filter=upcoming`
      )
      this.eventsObject = data
    } catch (error) {
      throw new Error(error)
    }
  },
  head () {
    return {
      title: 'Upcoming events'
    }
  },
  auth: false
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12">
            <h3>Events happening on {{ $moment($route.query.date).calendar() }}</h3>
          </v-col>

          <v-col
            v-for="(e, i) in events"
            :key="i"
            cols="12"
            md="4"
          >
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
                  {{ e.about }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      events: []
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get(
        `/api/search/calendar?date=${this.$route.query.date}`
      )
      this.events = data
    } catch (error) {
      throw new Error(error)
    }
  },
  auth: false
}
</script>

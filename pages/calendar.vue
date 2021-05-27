<template>
  <v-container>
    <NavigatorBar />
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12">
            <h3>
              Events happening {{ $moment($route.query.date).calendar(null, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: '[next] dddd',
                lastDay: '[Yesterday]',
                lastWeek: '[last] dddd',
                sameElse: '[on] DD/MM/YYYY'
              }) }}
            </h3>
          </v-col>
          <template v-if="events.length > 0">
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
          </template>

          <v-col v-else cols="12" md="8">
            <h1 class="title">
              No events found
            </h1>
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
    if (process.client) {
      this.$http.setBaseURL(process.env.APP_URL)
    }
    try {
      const { data } = await this.$http.get(
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

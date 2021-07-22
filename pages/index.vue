<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-img contain src="https://res.cloudinary.com/streetcoder/image/upload/v1626949280/events254/undraw_events_2p66_sx7tl4.svg" />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <h3>Events254</h3>
        <p class="body-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus minus consequatur ipsum vitae, voluptatum eaque, perferendis excepturi alias harum nemo dolorum rem quasi magni ut totam sequi repellendus dicta doloremque!
        </p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-row>
          <v-col v-for="i in 6" :key="i" sm="6" md="4" cols="12">
            <v-card flat>
              <v-img gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)" height="80" src="https://source.unsplash.com/random">
                <v-row no-gutters justify="center" align="center" style="height: 100%;">
                  <v-col class="text-center white--text">
                    <h1 class="title">
                      Category {{ i }}
                    </h1>
                  </v-col>
                </v-row>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <client-only>
      <FetchLoading v-if="$fetchState.pending" landing-page />
      <FetchError v-else-if="$fetchState.error" />

      <v-row v-else justify="center">
        <v-col cols="12" md="8">
          <div v-if="eventsObject.events.length === 0" class="text-center">
            <h3>Nothing here</h3>
          </div>
          <v-row v-else>
            <v-col cols="12">
              <h3>Events near Nairobi</h3>
            </v-col>

            <v-col
              v-for="(e, i) in eventsObject.events"
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
                <v-img height="150" class="pa-3" :src="e.image">
                  <h1 class="white--text custom-shadow display-2">
                    {{ new Date(e.startDate).getDate() }}
                    {{ months[$moment(e.startDate).month()] }}
                  </h1>
                </v-img>
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
    </client-only>

    <v-row justify="center">
      <v-col cols="12" md="4">
        <v-btn
          v-if="eventsObject.nextPageUrl != null"
          large
          color="primary"
          block
          rounded
          depressed
          @click="loadMore"
        >
          Load more
        </v-btn>
      </v-col>
    </v-row>

    <v-col cols="12">
      <v-btn
        to="/events/create"
        color="accent"
        fab
        fixed
        right
        bottom
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      searchQuery: null,
      noMoreEvents: false,
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      filter: {
        category: []
      },
      eventsObject: {}
    }
  },
  async fetch () {
    if (process.client) {
      this.$http.setBaseURL(process.env.APP_URL)
    }
    try {
      const data = await this.$http.get('/api/events?paginate=6')
      this.eventsObject = await data.json()
    } catch (error) {
      throw new Error(error)
    }
  },
  auth: false,
  methods: {
    search () {
      this.$router.push(`/search?q=${this.searchQuery}`)
    },
    async loadMore () {
      const { data } = await this.$axios.get(this.eventsObject.nextPageUrl)
      if (data.events.length === 0) {
        this.noMoreEvents = true
        return
      }
      this.eventsObject.nextPageUrl = data.nextPageUrl
      data.events.forEach((ev) => {
        this.eventsObject.events.push(ev)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.one-line {
  white-space: nowrap;
  overflow: hidden;
}
</style>

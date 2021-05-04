<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="display-2">
          Discover upcoming events
        </h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="searchQuery"
          outlined
          rounded
          placeholder="Find something awesome"
          append-icon="mdi-magnify"
          @click:append="search"
        />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <HomePageCalendar />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <h3 class="title">
          Browse by category
        </h3>
      </v-col>
      <v-col cols="12" md="8">
        <v-chip-group v-model="filter.category" color="primary" multiple>
          <v-chip>Technology</v-chip>
          <v-chip>Sports</v-chip>
          <v-chip>Religious</v-chip>
          <v-chip>AI</v-chip>
          <v-chip>Cars</v-chip>
          <v-chip>Better living</v-chip>
          <v-chip>Webinars</v-chip>
          <v-chip>Hackathons</v-chip>
          <v-chip>Birthdays</v-chip>
          <v-chip>Hiking</v-chip>
          <v-chip>Camping</v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-row>
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

    <v-row justify="center">
      <v-col cols="12" md="4">
        <v-btn
          v-if="!noMoreEvents"
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
    try {
      const { data } = await this.$axios.get('/api/p/events?paginate=6')
      this.eventsObject = data
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

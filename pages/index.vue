<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="display-1">
          Discover upcoming events
        </h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-text-field
          outlined
          rounded
          placeholder="Find something awesome"
          append-icon="mdi-magnify"
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
        <v-chip-group>
          <v-chip>Technology</v-chip>
          <v-chip>Sports</v-chip>
          <v-chip>Religious</v-chip>
          <v-chip>AI</v-chip>
          <v-chip>Cars</v-chip>
          <v-chip>Better living</v-chip>
          <v-chip>Webinars</v-chip>
          <v-chip>Hackathons</v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="6">
        <h3>Events near Nairobi</h3>

        <v-card
          v-for="(e, i) in events"
          :key="i"
          outlined
          :to="`/events/${e.id}`"
          class="ma-2"
          rounded
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ e.about }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-icon>mdi-calendar</v-icon>
                {{ new Date(e.startDate).toDateString() }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <v-icon>mdi-map-marker</v-icon>
                {{ e.location }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-img height="100" width="100" :src="e.image" />
            </v-list-item-icon>
          </v-list-item>
        </v-card>
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
    try {
      const { data } = await this.$axios.get('/api/p/events')
      this.events = data
    } catch (error) {
      throw new Error(error)
    }
  },
  auth: false
}
</script>

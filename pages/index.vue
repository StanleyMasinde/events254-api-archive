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

          <v-col v-for="(e, i) in events" :key="i" cols="12" md="4">
            <v-card outlined :to="`/events/${e.id}`" class="ma-2" rounded>
              <v-img height="150" :src="e.image" />
              <v-card-title>
                <h4 class="one-line" :title="e.about">
                  {{ e.about }}
                </h4>
              </v-card-title>
              <v-card-text class="body-1">
                <p>
                  <v-icon>mdi-calendar</v-icon>
                  {{ new Date(e.startDate).toDateString() }}
                  <br>
                  <v-icon>mdi-map-marker</v-icon>
                  {{ e.location }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
      filter: {
        category: []
      },
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

<style lang="scss" scoped>
.one-line {
  white-space: nowrap;
  overflow: hidden;
}
</style>

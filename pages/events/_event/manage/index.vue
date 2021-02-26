<template>
  <div class="mt-5">
    <v-btn depressed color="primary" rounded>
      Publish your event
    </v-btn>
    <v-btn text :to="`/events/${$route.params.event}`">
      View event
    </v-btn>
    <!-- Featured Image -->
    <h1 class="display-1">
      Featured image
    </h1>
    <v-img :src="currentEvent.image" height="100" contain width="200" />
    <ValidationProvider v-slot="{ errors }" rules="required">
      <v-file-input
        v-model="updatedEvent.poster"
        :error-messages="errors"
        name="image"
        outlined
        prepend-icon=""
        label="Change featured image"
      />
    </ValidationProvider>
    <!-- About information -->
    <h1 class="display-1">
      About event
    </h1>
    <h3>
      {{ currentEvent.about }}
    </h3>
    <ValidationProvider v-slot="{ errors }" rules="required">
      <v-text-field
        v-model="updatedEvent.title"
        :error-messages="errors"
        name="about"
        outlined
        label="New event subject"
      />
    </ValidationProvider>
  </div>
</template>
<script>
import moment from 'moment-timezone'
export default {
  data () {
    return {
      updatedEvent: {},
      currentEvent: {}
    }
  },
  async fetch () {
    const { data } = await this.$axios.get(`/api/events/${this.$route.params.event}`)
    this.currentEvent = data
  },
  computed: {
    eventData () {
      const [date] = new Date(this.currentEvent.from).toLocaleString().split(',')
      const m = moment(this.currentEvent.from)
      const fromTime = `${m.hours()}:${m.minutes()}`
      return {
        type: this.currentEvent.type,
        title: this.currentEvent.title,
        from_date: date,
        from_time: fromTime,
        description: this.currentEvent.description
      }
    }
  }
}
</script>

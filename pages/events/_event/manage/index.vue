<template>
  <div class="mt-5">
    <!-- Featured Image -->
    <h1 class="display-1">
      Featured image
    </h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-img :src="currentEvent.image" height="100" contain width="200" />
      </v-col>
      <v-col cols="12" md="6">
        <ValidationProvider v-slot="{ errors }" rules="required">
          <v-file-input
            v-model="updatedEvent.poster"
            :error-messages="errors"
            name="image"
            outlined
            prepend-inner-icon="mdi-image-outline"
            prepend-icon=""
            label="Change featured image"
          />
          <v-btn rounded color="primary" depressed>
            Update picture
          </v-btn>
        </ValidationProvider>
      </v-col>
    </v-row>
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
      const m = this.$moment(this.currentEvent.from)
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

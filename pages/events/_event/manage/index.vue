<template>
  <div class="mt-5">
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-form id="eventForm" ref="form" @submit.prevent="">
        <ValidationProvider v-slot="{ errors }" rules="required">
          <v-select
            v-model="eventData.type"
            name="type"
            :error-messages="errors"
            label="Event type"
            outlined
            :items="['Physical', 'Online']"
          />
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" rules="required">
          <v-text-field
            v-model="eventData.title"
            :error-messages="errors"
            name="title"
            outlined
            label="Title"
          />
        </ValidationProvider>

        <v-row>
          <v-col cols="12" md="6">
            <DateInput
              v-model="eventData.from_date"
              name="from_date"
              label="Starting date"
            />
          </v-col>
          <v-col cols="12" md="6">
            <TimeInput v-model="eventData.from_time" label="Starting time" name="from_time" />
          </v-col>
        </v-row>

        <ValidationProvider v-slot="{errors}" rules="required">
          <v-textarea
            v-model="eventData.description"
            :error-messages="errors"
            outlined
            rows="1"
            auto-grow
            label="Describe your event"
            name="description"
          />
        </ValidationProvider>
        <v-btn
          :disabled="invalid"
          type="submit"
          large
          depressed
          color="accent"
        >
          Update information
        </v-btn>
      </v-form>
    </ValidationObserver>
  </div>
</template>
<script>
import moment from 'moment-timezone'
export default {
  data () {
    return {
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

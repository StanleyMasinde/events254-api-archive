<template>
  <v-row justify="center">
    <v-col cols="12" md="10">
      <h1 class="display-2">
        New Event
      </h1>
    </v-col>
    <v-col cols="12" md="7">
      <v-card flat rounded>
        <v-card-text>
          <v-alert v-if="message.success" type="success">
            Event created
          </v-alert>
          <ValidationObserver ref="observer" v-slot="{ invalid }">
            <v-form id="eventForm" ref="form" @submit.prevent="createEvent">
              <ValidationProvider v-slot="{ errors }" rules="required">
                <v-file-input
                  v-model="event.poster"
                  :error-messages="errors"
                  name="poster"
                  outlined
                  prepend-icon=""
                  label="Event picture"
                />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" rules="required">
                <v-select
                  v-model="event.type"
                  name="type"
                  :error-messages="errors"
                  label="Event type"
                  outlined
                  :items="['Physical', 'Online']"
                />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" rules="required">
                <v-text-field
                  v-model="event.title"
                  :error-messages="errors"
                  name="title"
                  outlined
                  label="Title"
                />
              </ValidationProvider>

              <DateInput
                v-model="event.date"
                name="date"
              />

              <TimeInput v-model="event.time" label="From" />

              <ValidationProvider v-slot="{errors}" rules="required">
                <v-textarea
                  v-model="event.description"
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
                Create event
              </v-btn>
            </v-form>
          </ValidationObserver>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data () {
    return {
      message: {
        success: null,
        err: null
      },
      event: {
        poster: null,
        type: null,
        meeting_link: null,
        title: null,
        description: null,
        date: null,
        time: null,
        duration: 'All day'
      }
    }
  },
  head () {
    return {
      title: 'Create a new Event'
    }
  },
  methods: {
    async createEvent () {
      const form = document.querySelector('#eventForm')
      const formData = new FormData(form)
      formData.append('date', this.event.date)
      formData.append('time', this.event.time)
      formData.append('duration', this.event.duration)
      try {
        await this.$axios.post('/api/events', formData)
        this.message.success = true
        this.$refs.observer.reset()
        this.$refs.form.reset()
        window.scrollTo({
          top: 100,
          left: 100,
          behavior: 'smooth'
        })

        setTimeout(() => {
          this.message.success = false
        }, 5000)
      } catch (error) {}
    }
  }
}
</script>

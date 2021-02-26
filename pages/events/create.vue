<template>
  <v-row justify="center">
    <v-col cols="12" md="10">
      <h1 class="display-1">
        New Event
      </h1>
    </v-col>
    <v-col cols="12" md="6">
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
                  name="image"
                  outlined
                  prepend-icon=""
                  label="Event picture"
                />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" name="Location" rules="required">
                <v-select
                  v-model="event.location"
                  :error-messages="errors"
                  label="Location"
                  outlined
                  :items="['Enter location', 'Virtual']"
                />
              </ValidationProvider>

              <!-- If the selected location is physical -->
              <ValidationProvider v-if="event.location === 'Enter location'" v-slot="{ errors }" name="Address" rules="required">
                <v-textarea
                  v-model="event.address"
                  label="Address"
                  outlined
                  auto-grow
                  name="location"
                  rows="1"
                  :error-messages="errors"
                />
              </ValidationProvider>

              <!-- If the seleted option is Virtual. We ask for an optional link -->
              <ValidationProvider v-if="event.location === 'Virtual'" v-slot="{ errors }" name="Address" rules="required">
                <v-text-field name="online_link" outlined hint="Can be blank" :error-messages="errors" label="Meeting Link" />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" rules="required">
                <v-text-field
                  v-model="event.title"
                  :error-messages="errors"
                  name="about"
                  outlined
                  label="What is the event about?"
                />
              </ValidationProvider>

              <v-row>
                <v-col cols="12" md="6">
                  <DateInput
                    v-model="event.from_date"
                    name="from_date"
                    label="Starting date"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <TimeInput v-model="event.from_time" label="Starting time" name="from_time" />
                </v-col>
              </v-row>

              <ValidationProvider rules="required">
                <RichEditor v-model="event.description" />
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
import RichEditor from '~/components/RichEditor.vue'
export default {
  components: { RichEditor },
  data () {
    return {
      message: {
        success: null,
        err: null
      },
      event: {
        image: null,
        location: null,
        online_link: null,
        about: null,
        description: null,
        from_date: null,
        from_time: null
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
      formData.append('from_date', this.event.from_date)
      formData.append('from_time', this.event.from_time)
      try {
        const { data } = await this.$axios.post('/api/events', formData)
        this.message.success = true
        this.$router.push(`/events/${data.id}/manage`)
        // this.$refs.observer.reset()
        // this.$refs.form.reset()
        // window.scrollTo({
        //   top: 100,
        //   left: 100,
        //   behavior: 'smooth'
        // })

        // setTimeout(() => {
        //   this.message.success = false
        // }, 5000)
      } catch (error) {
        if (error.response.status === 422) {
          this.$refs.form.setErrors(error.response.data.errors)
          return
        }
        // TODO add proper handling
        throw new Error(error)
      }
    }
  }
}
</script>

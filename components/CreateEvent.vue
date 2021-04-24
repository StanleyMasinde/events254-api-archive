<template>
  <div>
    <v-alert v-if="message.success" type="success">
      Event created
    </v-alert>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-form id="eventForm" ref="form" @submit.prevent="createEvent">
        <v-stepper v-model="currentStep" vertical>
          <!-- Step one -->
          <v-stepper-step step="1" :complete="currentStep > 1">
            Event type
          </v-stepper-step>

          <v-stepper-content step="1">
            <ValidationProvider
              v-slot="{ errors, valid }"
              name="Location"
              rules="required"
            >
              <v-select
                v-model="event.location"
                data-evtype
                :error-messages="errors"
                label="Location"
                outlined
                :items="['Physical address', 'Virtual']"
              />
              <v-btn
                :disabled="!valid"
                color="primary"
                @click="currentStep = 2"
              >
                Next
              </v-btn>
            </ValidationProvider>
          </v-stepper-content>
          <!--/ Step one -->

          <!-- Step two -->
          <v-stepper-step step="2" :complete="currentStep > 2">
            Event name
          </v-stepper-step>

          <v-stepper-content step="2">
            <ValidationProvider v-slot="{ errors, valid }" rules="required">
              <v-text-field
                v-model="event.title"
                :error-messages="errors"
                name="about"
                outlined
                label="What is the event about?"
              />
              <v-btn
                :disabled="!valid"
                color="primary"
                @click="currentStep = 3"
              >
                Next
              </v-btn>
            </ValidationProvider>
          </v-stepper-content>
          <!--/ Step two -->

          <!-- Step three -->
          <v-stepper-step step="3" :complete="currentStep > 3">
            Describe event
          </v-stepper-step>

          <v-stepper-content step="3">
            <ValidationProvider rules="required">
              <RichEditor v-model="event.description" />
            </ValidationProvider>
            <v-btn
              :disabled="!event.description"
              color="primary"
              @click="currentStep = 4"
            >
              Next
            </v-btn>
          </v-stepper-content>
          <!--/ Step three -->

          <!-- Step Four -->
          <v-stepper-step step="4">
            Event location
          </v-stepper-step>

          <v-stepper-content step="4">
            <!-- If the selected location is physical -->
            <ValidationProvider
              v-if="event.location === 'Physical address'"
              v-slot="{ errors, valid }"
              name="Address"
              rules="required"
            >
              <v-textarea
                v-model="event.address"
                label="Address"
                outlined
                auto-grow
                name="location"
                rows="1"
                :error-messages="errors"
              />
              <v-btn
                :disabled="!valid"
                color="primary"
                @click="currentStep = 5"
              >
                Next
              </v-btn>
            </ValidationProvider>

            <!-- If the seleted option is Virtual. We ask for an optional link -->
            <ValidationProvider
              v-if="event.location === 'Virtual'"
              v-slot="{ errors, valid }"
              name="Address"
              rules="required"
            >
              <v-text-field
                name="online_link"
                outlined
                hint="Can be blank"
                :error-messages="errors"
                label="Meeting Link"
              />
              <v-btn
                :disabled="!valid"
                color="primary"
                @click="currentStep = 5"
              >
                Next
              </v-btn>
            </ValidationProvider>
          </v-stepper-content>
          <!--/ Step Four -->

          <!-- Step five -->
          <v-stepper-step step="5">
            Event date and time
          </v-stepper-step>

          <v-stepper-content step="5">
            <v-row>
              <v-col cols="12" md="6">
                <DateInput
                  v-model="event.from_date"
                  name="from_date"
                  label="Starting date"
                />
              </v-col>
              <v-col cols="12" md="6">
                <TimeInput
                  v-model="event.from_time"
                  label="Starting time"
                  input-name="from_time"
                />
              </v-col>
            </v-row>

            <ValidationProvider v-slot="{ errors }" rules="required">
              <v-file-input
                v-model="event.poster"
                :error-messages="errors"
                name="image"
                accept="image/*"
                outlined
                prepend-icon=""
                label="Event picture"
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
          </v-stepper-content>
        </v-stepper>
        <!--/ Step Five -->
      </v-form>
    </ValidationObserver>
  </div>
</template>
<script>
export default {
  props: {
    createUrl: {
      type: String,
      default: '/api/events'
    }
  },
  data () {
    return {
      currentStep: 1,
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
        const { data } = await this.$axios.post(this.createUrl, formData)
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
          this.$refs.observer.setErrors(error.response.data.errors)
          return
        }
        // TODO add proper handling
        throw new Error(error)
      }
    }
  }
}
</script>

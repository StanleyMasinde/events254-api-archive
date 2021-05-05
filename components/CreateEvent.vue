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
            <small>Is it physical or online?</small>
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
            <small>Eg. Introduction to online trading</small>
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
            <small>Agenda? Charges or anything relevant</small>
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
          <v-stepper-step step="4" :complete="currentStep > 4">
            Event location
            <small>Where is the event? Share a link where necessary</small>
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
          <v-stepper-step step="5" :complete="currentStep > 4">
            Event date and time
            <small>When is the event?</small>
          </v-stepper-step>

          <v-stepper-content step="5">
            <v-row>
              <!-- Start date -->
              <v-col class="my-1" cols="12" md="6">
                <ValidationProvider
                  rules="required"
                >
                  <DateInput
                    v-model="event.start_date"
                    name="start_date"
                    label="Starting date"
                  />
                </ValidationProvider>
              </v-col>

              <!-- Start time -->
              <v-col cols="12" md="6" class="my-1">
                <ValidationProvider
                  rules="required"
                >
                  <TimeInput
                    v-model="event.start_time"
                    label="Starting time"
                    input-name="start_time"
                  />
                </ValidationProvider>
              </v-col>

              <!-- End date -->
              <v-col>
                <ValidationProvider
                  rules="required"
                >
                  <DateInput
                    v-model="event.end_date"
                    name="end_date"
                    label="Starting date"
                  />
                </ValidationProvider>
              </v-col>

              <!-- End time -->
              <v-col cols="12" md="6" class="my-1">
                <ValidationProvider
                  rules="required"
                >
                  <TimeInput
                    v-model="event.end_time"
                    label="Starting time"
                    input-name="end_time"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <v-btn
                  :disabled="event.start_date === event.start_time"
                  color="primary"
                  @click="currentStep = 6"
                >
                  Next
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <!-- Step six -->
          <v-stepper-step step="6" :complete="currentStep > 4">
            Event poster
            <small>Does the event have a poster/picture?</small>
          </v-stepper-step>

          <v-stepper-content step="6">
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
        start_date: null,
        start_time: null
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
      formData.append('start_date', this.event.start_date)
      formData.append('start_time', this.event.start_time)
      formData.append('end_date', this.event.end_date)
      formData.append('end_time', this.event.end_time)
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

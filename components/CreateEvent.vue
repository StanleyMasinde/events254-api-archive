<template>
  <div>
    <client-only>
      <v-alert v-if="message.success" type="success">
        Event created
      </v-alert>
      <ValidationObserver ref="observer" v-slot="{ invalid }">
        <v-form id="eventForm" ref="form" @submit.prevent="createEvent">
          <v-card flat outlined style="width:100vw;" class="mb-2">
            <v-card-text>
              <v-text-field v-model="event.about" style="font-weight:700;" filled rounded placeholder="Title" />
              <v-row>
                <v-col>
                  <DateInput v-model="event.startDate" name="startDate" label="Start" value="" />
                </v-col>
                <v-col v-if="!isAllDay">
                  <TimeInput v-model="event.startTime" name="startTime" />
                </v-col>
              </v-row>

              <v-row v-if="hasEndDate">
                <v-col>
                  <DateInput v-model="event.endDate" name="endDate" label="End" value="" />
                </v-col>
                <v-col v-if="!isAllDay">
                  <TimeInput v-model="event.startTime" name="endTime" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="text-right">
              <v-checkbox v-model="hasEndDate" hint="If the event has no end time" label="Add end date" />
              <v-checkbox v-model="isAllDay" hint="If the event has no end time" label="All day" />
            </v-card-actions>
          </v-card>

          <v-text-field
            v-if="!isVirtual"
            v-model="event.location"
            class="ma-0"
            autocomplete="address-level1"
            placeholder="Location"
            rounded
            filled
            prepend-inner-icon="mdi-map-marker"
          />
          <v-text-field
            v-else
            v-model="event.online_link"
            class="ma-0"
            autocomplete="url"
            placeholder="Meeting link"
            rounded
            filled
            type="url"
            hint="You can add this later"
            prepend-inner-icon="mdi-link"
          />
          <v-checkbox v-model="isVirtual" class="ma-0" hint="If the event is online" label="It is a virtual event" />

          <RichEditor v-model="event.description" />
          <v-btn large depressed rounded color="primary" :disabled="invalid">
            Next
          </v-btn>
        </v-form>
      </ValidationObserver>
    </client-only>
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
      isAllDay: false,
      hasEndDate: false,
      isVirtual: false,
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
        startDate: null,
        startTime: null
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
      formData.append('startDate', this.event.start_date)
      formData.append('startTime', this.event.start_time)
      formData.append('endDate', this.event.end_date)
      formData.append('endTime', this.event.end_time)
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

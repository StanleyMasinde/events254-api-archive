<template>
  <div>
    <v-alert v-if="message.success" type="success">
      Event created
    </v-alert>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-form id="eventForm" ref="form" @submit.prevent="createEvent">
        <v-card flat hover outlined class="mb-2">
          <v-card-text>
            <v-text-field filled rounded placeholder="Title" />
            <DateInput name="startDate" label="Start" value="" />
            <DateInput name="endDate" label="End" value="" />
          </v-card-text>
          <v-card-actions class="text-right">
            <v-chip>All day</v-chip>
            <v-chip>End time</v-chip>
          </v-card-actions>
        </v-card>
        <input autocomplete="address-level1">

        <v-text-field autocomplete="address-level1" placeholder="Location" rounded filled prepend-inner-icon="mdi-map-marker" />
        <client-only>
          <RichEditor />
        </client-only>
        <!-- <v-textarea
          rows="1"
          auto-grow
          autocomplete="address-level1"
          placeholder="Event description"
          rounded
          filled
          prepend-inner-icon="mdi-text-box-outline"
        /> -->
        <v-btn large depressed rounded color="primary" :disabled="invalid">
          Next
        </v-btn>
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

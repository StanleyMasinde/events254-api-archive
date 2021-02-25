<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mx-auto" flat>
          <v-img
            :src="currentEvent.image"
            class="align-end"
            height="400px"
          >
            <v-card-title>
              <h1 class="custom-shadow display-1 white--text">
                {{ currentEvent.about }}
              </h1>
            </v-card-title>
            <v-card-subtitle>
              <h3 class="title custom-shadow white--text">
                <v-icon class="white--text">
                  mdi-map-marker
                </v-icon>
                {{ currentEvent.venue || "To be decided" }}
              </h3>
              <h3 class="custom-shadow white--text">
                <v-icon class="white--text">
                  mdi-calendar
                </v-icon>
                {{ $moment(currentEvent.startDate).fromNow() }}
              </h3>
            </v-card-subtitle>
          </v-img>
          <v-card-actions>
            <v-btn
              v-if="currentEvent.can_edit"
              text
              :to="`/events/${currentEvent.id}/manage`"
            >
              Manage event
            </v-btn>
            <v-btn icon color="primary">
              <v-icon>mdi-share</v-icon>
            </v-btn>
            <v-btn
              v-if="!currentEvent.can_edit"
              depressed
              color="primary"
              @click="showRegistrationDialog"
            >
              Register for this event
            </v-btn>
          </v-card-actions>
          <v-card-text class="body-1">
            <h3>About this event</h3>
            {{ currentEvent.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="registerDialog" width="400">
      <v-card>
        <v-card-title>Register for event</v-card-title>
        <v-card-text>
          <v-form>
            <v-select
              v-model="eventRsvp.ticket"
              label="Select ticket"
              outlined
              :items="ticks"
            />
            <v-text-field
              v-model="eventRsvp.rsvp_count"
              readonly
              append-outer-icon="mdi-plus"
              prepend-icon="mdi-minus"
              type="number"
              min="0"
              label="How many tickets?"
              outlined
              @click:append-outer="eventRsvp.rsvp_count++"
              @click:prepend="
                eventRsvp.rsvp_count > 1 ? eventRsvp.rsvp_count-- : ''
              "
            />
            Order total:
            {{
              formatCurrency(
                eventRsvp.ticket.price | (0 * eventRsvp.rsvp_count)
              )
            }}
            <v-btn color="primary" block @click="confirmOrder">
              Confirm order
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      availableTickets: [],
      eventRsvp: {
        ticket: {},
        rsvp_count: 1
      },
      currentEvent: {},
      registerDialog: false
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get(
        `/api/events/${this.$route.params.event}`
      )
      this.currentEvent = data
    } catch (error) {
      throw new Error(error)
    }
  },
  computed: {
    ticks () {
      return this.availableTickets.map((t) => {
        return {
          text: `${t.description} - ${this.formatCurrency(t.price)}`,
          value: t
        }
      })
    }
  },
  methods: {
    async confirmOrder () {
      try {
        await this.$axios.post(
          `/api/events/${this.$route.params.event}/register`,
          {
            ticket_id: this.eventRsvp.ticket.id,
            rsvp_count: this.eventRsvp.rsvp_count
          }
        )
        // TODO I honestly don't know what to do here
        // I will just close the Modal for now
      } catch (error) {
        throw new Error(error)
      }
    },
    formatCurrency (value = 0) {
      return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'kes'
      }).format(value)
    },
    async showRegistrationDialog () {
      this.registerDialog = true
      const { data } = await this.$axios.get(
        `/api/events/${this.$route.params.event}/tickets`
      )
      this.availableTickets = data
    }
  }
}
</script>
<style lang="scss">
.custom-shadow {
  text-shadow: 5px 5px 6px #363636;
}
</style>

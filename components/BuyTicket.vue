<template>
  <div>
    <v-btn v-if="past" disabled rounded color="error">
      Past event
    </v-btn>
    <v-btn
      v-else
      rounded
      depressed
      color="primary"
      @click="showRegistrationDialog"
    >
      Buy tickets
    </v-btn>
    <v-dialog
      v-if="!currentEvent.currentUserTicket"
      v-model="registerDialog"
      width="400"
    >
      <v-card>
        <v-card-title>Register for event</v-card-title>
        <v-card-text>
          <ValidationObserver v-if="tickets.length !== 0" v-slot="{ invalid }">
            <v-form>
              <ValidationProvider v-slot="{ errors }" rules="required">
                <v-select
                  v-model="eventRsvp.ticket"
                  :error-messages="errors"
                  label="Select ticket"
                  outlined
                  :items="ticks"
                />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" rules="required">
                <v-text-field
                  v-model="eventRsvp.rsvp_count"
                  :error-messages="errors"
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
              </ValidationProvider>

              Order total:
              {{
                eventRsvp.ticket.price
                  ? formatCurrency(
                    eventRsvp.ticket.price * eventRsvp.rsvp_count
                  )
                  : 0
              }}
              <v-btn
                :disabled="invalid"
                color="primary"
                block
                @click="confirmOrder"
              >
                Confirm order
              </v-btn>
            </v-form>
          </ValidationObserver>

          <p v-else class="body-1">
            This is event has no tickets please follow the instructions on the
            event description on how to register
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    past: {
      type: Boolean,
      default: false
    },
    tickets: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      eventRsvp: {
        ticket: {},
        rsvp_count: 1
      },
      currentEvent: {},
      registerDialog: false
    }
  },
  computed: {
    ticks () {
      return this.tickets.map((t) => {
        return {
          text: `${t.type} - ${this.formatCurrency(t.price)}`,
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
        this.$router.push('/home/tickets')
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
      if (!this.$auth.loggedIn) {
        this.$store.state.auth.redirect = this.$router.path
        this.$router.push('/login')
      }
      this.registerDialog = true
      const { data } = await this.$axios.get(
        `/api/events/${this.$route.params.event}/tickets`
      )
      this.availableTickets = data
    }
  }
}
</script>

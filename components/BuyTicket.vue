<template>
  <div>
    <v-btn
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
          <ValidationObserver v-slot="{invalid}">
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
                formatCurrency(
                  eventRsvp.ticket.price * eventRsvp.rsvp_count
                )
              }}
              <v-btn :disabled="invalid" color="primary" block @click="makePayment">
                Confirm order
              </v-btn>
            </v-form>
          </ValidationObserver>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
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
  computed: {
    ticks () {
      return this.availableTickets.map((t) => {
        return {
          text: `${t.type} - ${this.formatCurrency(t.price)}`,
          value: t
        }
      })
    }
  },
  methods: {
    makePayment () {
      const rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      window.FlutterwaveCheckout({
        public_key: process.env.FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: `event-${this.$route.params.event}-user-${this.$auth.user.id}${rand}`,
        amount: 1,
        currency: 'KES',
        country: 'KE',
        payment_options: 'card, mobilemoneykenya, ussd',
        redirect_url: `http://localhost:3000/events/${this.$route.params.event}`,
        meta: {
          eventId: this.$route.params.event,
          ticketId: this.eventRsvp.ticket.id,
          ticketCount: this.eventRsvp.rsvp_count
        },
        customer: {
          email: this.$auth.user.email,
          phone_number: null,
          name: this.$auth.user.name
        },
        onclose () {
          // window.pay
        },
        callback (data) {
          if (data.status === 'successful') {
            this.confirmOrder()
          }
        },
        customizations: {
          title: 'Ticket purchase',
          description: 'Ticket purchase from events254',
          logo: 'https://events.opensource254.co.ke/icon.png'
        }
      })
    },
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

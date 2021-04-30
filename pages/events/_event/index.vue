<template>
  <v-container fluid>
    <!-- Still loading the group information -->
    <v-row v-if="$fetchState.pending" justify="center">
      <h1>Loading</h1>
    </v-row>

    <!-- Something went wrong! 😭 -->
    <v-row v-else-if="$fetchState.error">
      <div class="full-height">
        <v-img height="300" contain src="/not_found.svg">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="8">
                <h1 class="display-1 gray--text">
                  Sorry 😢 There's nothing here
                </h1>
                <v-btn text x-large color="primary" to="/">
                  Go home
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </div>
    </v-row>
    <!-- Event body -->
    <v-row v-else justify="center">
      <v-col cols="12" md="10">
        <p>
          <span class="text--secondary">{{
            $moment(currentEvent.startDate).format("MMMM Do YYYY [at] h:mm a")
          }}</span>
          <br>
          <span class="text-h4 font-weight-bold">
            {{ currentEvent.about }}
          </span>
        </p>
      </v-col>
      <v-col cols="12" md="10">
        <v-row>
          <v-col cols="12" md="8">
            <v-img height="300" :src="currentEvent.image" />
          </v-col>
          <v-col class="sticky-top" cols="12" md="4">
            <v-card flat>
              <v-card-text class="body-1">
                <span
                  class="red--text"
                >From {{ $moment(currentEvent.startDate).format("LT") }} to
                  {{ $moment(currentEvent.endDate).format("LT") }}
                </span>
                <br>
                Event by:
                <router-link :to="organiserLink">
                  {{
                    currentEvent.organiser ? currentEvent.organiser.name : "N/A"
                  }}
                </router-link>
                <br>
                Location: {{ currentEvent.location || "Online" }}
              </v-card-text>
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
                <template v-if="!currentEvent.currentUserTicket">
                  <v-btn
                    v-if="!currentEvent.can_edit"
                    rounded
                    depressed
                    color="primary"
                    @click="showRegistrationDialog"
                  >
                    Register for this event
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn text disabled>
                    You are going to this event
                  </v-btn>
                  <v-btn
                    color="primary"
                    depressed
                    large
                    rounded
                    to="/home/tickets"
                  >
                    View your ticket
                  </v-btn>
                </template>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
            <v-card flat>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <v-card-text class="body-1" v-html="currentEvent.description" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- End of event body -->

    <v-dialog
      v-if="!currentEvent.currentUserTicket"
      v-model="registerDialog"
      width="400"
    >
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
  auth: false,
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
    organiserLink () {
      const organiser = this.currentEvent.organiser
      if (organiser.type === 'user') {
        return `/u/${organiser.id}`
      }
      return `/${organiser.slug}`
    },
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
<style lang="scss">
.custom-dark {
  filter: opacity(40);
}
</style>

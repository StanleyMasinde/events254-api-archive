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
            <v-card outlined>
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
              <template v-if="currentEvent.attendees">
                <v-card-text
                  v-if="currentEvent.attendees.length > 0"
                  class="body-1"
                >
                  <h5>Attendees</h5>
                  <div class="stacked-av">
                    <v-avatar
                      v-for="(a, i) in currentEvent.attendees"
                      :key="i"
                      :title="a.name"
                      color="brown"
                    >
                      <span>{{ innitials(a.name) }}</span>
                    </v-avatar>
                  </div>
                </v-card-text>
              </template>
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
                  <BuyTicket v-if="!currentEvent.can_edit" />
                </template>
                <template v-else>
                  You are going
                  <v-btn
                    color="primary"
                    depressed
                    large
                    rounded
                    to="/home/tickets"
                  >
                    View your tickets
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
      currentEvent: {
        about: null,
        organiser: { name: null }
      },
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
  head () {
    return {
      title: this.currentEvent.about || 'Events254',
      script: [
        {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: this.currentEvent.about,
            startDate: this.currentEvent.startDate,
            endDate: this.currentEvent.endDate,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: {
              '@type': 'Place',
              name: this.currentEvent.location,
              address: {
                '@type': 'PostalAddress',
                streetAddress: '37 Westlands road',
                addressLocality: 'Nairobi',
                postalCode: '30100',
                addressRegion: 'KE',
                addressCountry: 'KE'
              }
            },
            // location: {
            //   '@type': 'VirtualLocation',
            //   url: 'https://operaonline.stream5.com/'
            // },
            image: [`${this.currentEvent.image}`],
            description: this.currentEvent.description,
            offers: {
              '@type': 'Offer',
              url: `https://www.example.com/${this.currentEvent.id}`,
              price: '300',
              priceCurrency: 'KES',
              availability: 'https://schema.org/InStock',
              validFrom: '2024-05-21T12:00'
            },
            performer: {
              '@type': 'PerformingGroup',
              name: 'Kira and Morrison'
            },
            organizer: {
              '@type': 'Organization',
              name: this.currentEvent.organiser.name,
              url: `${this.organiserLink}`
            }
          }
        }
      ],
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.currentEvent.description || 'Loading group'
        }
      ]
    }
  },
  computed: {
    organiserLink () {
      const organiser = this.currentEvent.organiser
      if (organiser.type === 'user') {
        return `/u/${organiser.id}`
      }
      return `/${organiser.slug}`
    }
  },
  mounted () {
    if (this.$route.query.status) {
      const transactionId = this.$route.query.transaction_id
      this.verifyTransaction(transactionId)
    }
  },
  auth: false,
  methods: {
    async verifyTransaction (transactionID) {
      try {
        const { data } = await this.$axios.get(
          `/api/payments/verify/${transactionID}`
        )
        await this.$axios.post(
          `/api/events/${this.$route.params.event}/register`,
          {
            ticket_id: data.data.meta.ticketId,
            rsvp_count: data.data.meta.ticketCount
          }
        )
        this.$router.push('/home/tickets')
      } catch (error) {
        throw new Error(error)
      }
    },
    innitials (name) {
      const [firstName, lastName] = name.split(' ')
      if (!lastName) {
        return `${firstName.split('')[0]}`
      }
      return `${firstName.split('')[0]}${lastName.split('')[0]}`
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-dark {
  filter: opacity(40) !important;
}
.v-avatar {
  margin-right: -25px !important;
  border: 1px solid #fafafa !important;

  &:hover {
    z-index: 5;
  }
}
div {
  &.stacked-av {
    display: flex !important;
    overflow: scroll;
  }
}
</style>

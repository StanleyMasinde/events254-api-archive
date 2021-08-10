<template>
  <div>
    <v-app-bar flat>
      <v-toolbar-title>
        <v-btn icon to="/">
          <v-icon> mdi-arrow-left </v-icon>
        </v-btn>
        {{ currentEvent.about || "Events 254" }}
      </v-toolbar-title>
    </v-app-bar>
    <v-container fluid>
      <client-only>
        <!-- Still loading the group information -->
        <FetchLoading v-if="$fetchState.pending" event-page />

        <!-- Something went wrong! 😭 -->
        <FetchError v-else-if="$fetchState.error" />

        <!-- Event body -->
        <v-row v-else justify="center">
          <v-col cols="12" md="10">
            <p>
              <span v-if="currentEvent.allDay" class="text--secondary">
                All-Day event
              </span>
              <span v-else class="text--secondary">{{
                $moment(currentEvent.startDate).format(
                  "MMMM Do YYYY [at] h:mm a"
                )
              }}</span>
              <br>
              <span class="text-h5 font-weight-bold">
                {{ currentEvent.about }}
              </span>
            </p>
          </v-col>
          <v-col cols="12" md="10">
            <v-row>
              <v-col cols="12" md="8">
                <v-card flat>
                  <v-img height="300" :src="currentEvent.image" />
                </v-card>
              </v-col>
              <v-col class="sticky-top" cols="12" md="4">
                <v-card outlined>
                  <v-card-text class="body-1">
                    <span v-if="currentEvent.allDay" class="red--text">
                      All-Day Event
                    </span>
                    <span
                      v-else
                      class="red--text"
                    >From
                      {{ $moment(currentEvent.startDate).format("LT") }} to
                      {{ $moment(currentEvent.endDate).format("LT") }}
                    </span>
                    <br>
                    Event by:
                    <router-link :to="organiserLink">
                      {{
                        currentEvent.organiser
                          ? currentEvent.organiser.name
                          : "N/A"
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
                    <social-share :url="`/events/${currentEvent.id}`" :title="currentEvent.about" :description="currentEvent.description" />
                    <template v-if="!currentEvent.currentUserTicket">
                      <BuyTicket
                        v-if="!currentEvent.can_edit"
                        :past="currentEvent.past"
                        :tickets="currentEvent.tickets"
                      />
                    </template>
                    <template v-else>
                      {{ currentEvent.past ? "You went" : "You are going" }}
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
                  <v-card-text
                    class="body-1"
                    v-html="currentEvent.description"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- End of event body -->
      </client-only>
    </v-container>
  </div>
</template>
<script>
import SocialShare from '~/components/SocialShare.vue'
export default {
  components: { SocialShare },
  data () {
    return {
      availableTickets: [],
      eventRsvp: {
        ticket: {},
        rsvp_count: 1
      },
      currentEvent: {
        about: null,
        organiser: { name: null },
        tickets: []
      },
      registerDialog: false
    }
  },
  async fetch () {
    if (process.client) {
      this.$http.setBaseURL(process.env.APP_URL)
    }
    try {
      const data = await this.$http.get(
        `/api/events/${this.$route.params.event}`
      )
      this.currentEvent = await data.json()
    } catch (error) {
      throw new Error(error)
    }
  },
  head () {
    return {
      title: this.currentEvent ? this.currentEvent.about : 'Event',
      script: [
        {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: this.currentEvent ? this.currentEvent.about : 'Event',
            startDate: this.currentEvent ? this.currentEvent.startDate : null,
            endDate: this.currentEvent ? this.currentEvent.endDate : null,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode:
              'https://schema.org/OfflineEventAttendanceMode',
            location: {
              '@type': 'Place',
              name: this.currentEvent ? this.currentEvent.location : 'Online',
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
            image: [`${this.currentEvent ? this.currentEvent.image : ''}`],
            description: this.currentEvent ? this.currentEvent.description : '',
            offers: {
              '@type': 'Offer',
              url: `https://www.example.com/${
                this.currentEvent ? this.currentEvent.id : ''
              }`,
              price: this.currentEvent.tickets[0]
                ? this.currentEvent.tickets[0].price
                : 0,
              priceCurrency: 'KES',
              availability: 'https://schema.org/InStock',
              validFrom: `${
                this.currentEvent ? this.currentEvent.created_at : ''
              }`
            },
            // performer: {
            //   '@type': 'PerformingGroup',
            //   name: 'Kira and Morrison'
            // },
            organizer: {
              '@type': 'Organization',
              name: this.currentEvent ? this.currentEvent.organiser.name : '',
              url: `${this.organiserLink}`
            }
          }
        }
      ],
      meta: [
        {
          name: 'description',
          content: this.currentEvent.description || 'Loading group'
        },
        {
          property: 'og:title',
          content: this.currentEvent.about
        },
        {
          property: 'og:description',
          content: this.currentEvent.description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.currentEvent.image
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

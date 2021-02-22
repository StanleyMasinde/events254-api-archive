<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mx-auto" flat>
          <v-img :src="currentEvent.poster_url" class="align-end" height="350px">
            <v-card-title>
              <h1 class="custom-shadow white--text">
                {{ currentEvent.title }}
              </h1>
            </v-card-title>
            <v-card-subtitle>
              <h3 class="custom-shadow white--text">
                <v-icon class="white--text">
                  mdi-map-marker
                </v-icon>
                {{ currentEvent.venue || 'To be decided' }}
              </h3>
              <h3 class="custom-shadow white--text">
                <v-icon class="white--text">
                  mdi-calendar
                </v-icon>
                {{ new Date(currentEvent.from).toString() }}
              </h3>
            </v-card-subtitle>
          </v-img>
          <v-card-actions>
            <v-btn v-if="currentEvent.can_edit" text :to="`/events/${currentEvent.id}/manage`">
              Manage event
            </v-btn>
            <v-btn icon color="primary">
              <v-icon>mdi-share</v-icon>
            </v-btn>
            <v-btn v-if="!currentEvent.can_edit" depressed color="primary" @click="registerDialog = true">
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
            <v-select v-model="eventRsvp.ticket_id" label="Select ticket" outlined :items="['VIP', 'Regular', 'General']" />
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
              @click:prepend="eventRsvp.rsvp_count > 1 ? eventRsvp.rsvp_count-- : ''"
            />
            Order total: KES 0.00
            <v-btn color="primary" block>
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
      eventRsvp: {
        ticket_id: null,
        rsvp_count: 1
      },
      currentEvent: {},
      registerDialog: false
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get(`/api/events/${this.$route.params.event}`)
      this.currentEvent = data
    } catch (error) {
      throw new Error(error)
    }
  }
}
</script>
<style lang="scss">
.custom-shadow {
    text-shadow: 3px 3px 6px black;
}
</style>

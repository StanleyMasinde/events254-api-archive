<template>
  <div>
    <div v-if="!currentEvent.can_edit" class="error-page">
      <v-img src="/403.svg" height="100%">
        <h1 class="display-1">
          You are not authorized to view this page
        </h1>
      </v-img>
    </div>
    <template v-else>
      <v-row justify="center">
        <v-col cols="12" lg="8">
          <v-tabs centered grow>
            <v-tab :to="`/events/${$route.params.event}/manage`">
              General information
            </v-tab>
            <v-tab :to="`/events/${$route.params.event}/manage/ticket`">
              Ticket
            </v-tab>
            <v-tab :to="`/events/${$route.params.event}/manage/rsvps`">
              RSVPs
            </v-tab>
          </v-tabs>
          <nuxt-child />
        </v-col>
      </v-row>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentEvent: {}
    }
  },
  async fetch () {
    const { data } = await this.$axios.get(
      `/api/events/${this.$route.params.event}`
    )
    this.currentEvent = data
  }
}
</script>
<style lang="scss">
.error-page {
  height: 89vh;
  text-align: center;
  h1 {
    color: #ffffff;
    text-shadow: 3px 3px 7px #585757;
  }
}
</style>

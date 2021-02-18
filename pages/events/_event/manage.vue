<template>
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
<script>
export default {
}
</script>

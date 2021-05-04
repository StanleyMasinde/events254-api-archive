<template>
  <v-container>
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

    <v-row v-else justify="center">
      <v-col cols="12">
        <v-btn x-large color="primary" target="_blank" icon :to="`/tickets/${ticket.ticketId}/print`">
          <v-icon>mdi-printer</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="10">
        <Ticket :ticket="ticket" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      ticket: {}
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get(`/api/tickets/${this.$route.params.id}`)
      this.ticket = data
    } catch (error) {
      throw new Error(error)
    }
  }
}
</script>

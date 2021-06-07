<template>
  <v-row class="mt-5" justify="center">
    <v-col cols="12" md="8">
      <!-- Show a success alert -->
      <!-- <v-alert v-if="success" type="success">
        {{ success }}
      </v-alert> -->

      <div class="ma-5">
        <v-btn rounded depressed color="primary" @click="showCreating = true">
          Create a new ticket
        </v-btn>
        <!-- Ticket creation dialog -->
        <ticket-form
          :show="showCreating"
          @updated="$fetch"
          @hide="showCreating = false"
        />
      </div>
      <!-- When no tickets were found for the current event -->
      <div v-if="tickets.length === 0" class="ma-5 text-center">
        <h2>You have not created any tickets for this event</h2>
      </div>

      <!-- Hurray 🎉 we found some tickets -->
      <template v-else>
        <v-card
          v-for="(t, i) in tickets"
          :key="i"
          class="ma-5"
          rounded
          outlined
        >
          <v-card-text class="display-1">
            <p>
              Description: {{ t.type }} <br>
              Limit: {{ t.limit }} <br>
              Price:
              {{
                Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "kes",
                }).format(t.price)
              }}
            </p>
          </v-card-text>
          <v-card-actions class="text-center">
            <!-- Ticket Editing Dialog -->
            <ticket-form
              :editing="true"
              :current-ticket="t"
              :show="showEditing"
              @updated="$fetch"
              @hide="showEditing = false"
            />
            <v-btn text large color="primary" @click="showEditing = true">
              Edit <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn text large color="error" @click="deleteDialog = true">
              Delete <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
            <!-- Delete ticket dialog -->
            <v-dialog v-model="deleteDialog" width="300">
              <v-card rounded>
                <v-card-title>Are you sure?</v-card-title>
                <v-card-text class="body-1">
                  This action is irreversible
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    text
                    depressed
                    small
                    color="error"
                    @click="deleteTicket(t.id)"
                  >
                    Yes delete
                  </v-btn>
                  <v-btn
                    text
                    depressed
                    large
                    color="primary"
                    @click="deleteDialog = false"
                  >
                    No Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>
      </template>
    </v-col>
  </v-row>
</template>
<script>
import TicketForm from '~/components/TicketForm.vue'
export default {
  components: { TicketForm },
  data () {
    return {
      showEditing: false,
      showCreating: false,
      deleteDialog: false,
      tickets: []
    }
  },
  async fetch () {
    const { data } = await this.$axios.get(
      `/api/events/${this.$route.params.event}/tickets`
    )
    this.tickets = data
  },
  methods: {
    async deleteTicket (ticketId) {
      try {
        await this.$axios.delete(
          `/api/events/${this.$route.params.event}/tickets/${ticketId}`
        )
        this.deleteDialog = false
        this.$fetch()
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
</script>

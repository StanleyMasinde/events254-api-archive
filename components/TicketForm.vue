<template>
  <v-dialog v-model="showDialog" width="400">
    <v-card>
      <v-card-title>{{ editing ? 'Update ticket information' : 'Add ticket to event your event' }}</v-card-title>
      <v-card-text>
        <ValidationObserver ref="ticketForm" v-slot="{invalid}">
          <v-form class="mt-2" @submit.prevent="handleSubmit">
            <ValidationProvider v-slot="{ errors }" name="description" rules="required">
              <v-text-field
                v-model="ticket.type"
                :error-messages="errors"
                outlined
                label="Name your ticket"
                auto-grow
                rows="1"
                hint="example General admission"
              />
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="price" rules="required">
              <v-text-field
                v-model="ticket.price"
                min="0"
                :error-messages="errors"
                type="number"
                label="Price"
                outlined
              />
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="limit" rules="required">
              <v-text-field
                v-model="ticket.limit"
                :error-messages="errors"
                hint="0 removes the limit"
                min="0"
                type="number"
                label="Ticket limit per user"
                outlined
              />
            </ValidationProvider>

            <v-btn type="submit" :disabled="invalid" block color="primary">
              {{ editing ? 'Update ticket' :'Add ticket to event' }}
            </v-btn>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    },
    currentTicket: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      createTicketDialog: false,
      success: null,
      tickets: [],
      ticket: {
        type: 'General admission',
        price: 0,
        limit: 0
      }
    }
  },
  computed: {
    showDialog: {
      get () {
        return this.show
      },
      set () {
        // eslint-disable-next-line vue/no-mutating-props
        this.$emit('hide')
      }
    }
  },
  mounted () {
    if (this.currentTicket) { this.ticket = this.currentTicket }
  },
  methods: {
    async handleSubmit () {
      try {
        if (this.editing) {
          await this.$axios.put(`/api/events/${this.$route.params.event}/tickets/${this.currentTicket.id}`, this.ticket)
        } else {
          await this.$axios.post(`/api/events/${this.$route.params.event}/tickets`, this.ticket)
        }
        this.success = 'You have successfully added a ticket'
        this.createTicketDialog = false
        this.$emit('updated')
        this.$emit('hide')

        setTimeout(() => {
          this.success = null
        }, 5000)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
</script>

<template>
  <v-row class="mt-5" justify="center">
    <v-col cols="10">
      <h3>Create a ticket</h3>
      <ValidationObserver ref="ticketForm">
        <v-form class="mt-2" @submit.prevent="createTicket">
          <ValidationProvider name="price">
            <v-text-field type="number" label="Price" outlined />
          </ValidationProvider>
          <ValidationProvider name="limit">
            <v-text-field hint="The maximum number of tickets per person" type="number" label="Limit" outlined />
          </ValidationProvider>
          <ValidationProvider>
            <v-textarea outlined auto-grow rows="1" hint="This field is optional" />
          </ValidationProvider>
        </v-form>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>

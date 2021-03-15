<template>
  <v-row justify="center">
    <v-col cols="12" md="10">
      <h1 class="display-1">
        New Event
      </h1>
    </v-col>
    <v-col cols="12" md="6">
      <v-card flat rounded>
        <v-card-text>
          <v-alert v-if="message.success" type="success">
            Event created
          </v-alert>
          <CreateEvent />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

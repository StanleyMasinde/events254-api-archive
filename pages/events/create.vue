<template>
  <v-row justify="center">
    <v-col cols="12">
      <h1 class="display-1">
        New Event
      </h1>
    </v-col>
    <v-col cols="12">
      <v-card flat rounded>
        <v-card-text>
          <v-form>
            <v-file-input outlined label="Event picture" />
            <v-text-field outlined label="Title" />
            <v-text-field outlined label="Date" type="Date" />
            <v-text-field outlined label="From" type="time" />
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

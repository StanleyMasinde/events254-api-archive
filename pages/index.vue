<template>
  <v-row justify="center">
    <v-col cols="12" md="8">
      <h1 class="display-1">
        Discover upcoming events
      </h1>
    </v-col>

    <v-col cols="12" md="8">
      <v-text-field outlined rounded placeholder="Find something awesome" append-icon="mdi-magnify" />
    </v-col>

    <v-col cols="12">
      <v-btn
        to="/events/create"
        color="accent"
        fab
        fixed
        right
        bottom
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
export default {
  auth: false
}
</script>

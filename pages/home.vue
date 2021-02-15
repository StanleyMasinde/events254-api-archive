<template>
  <v-row justify="center">
    <v-col cols="11" sm="10">
      <h1 class="display-2">
        Hi {{ $auth.user.name }}
      </h1>
    </v-col>
    <v-col cols="12" md="6">
      <v-tabs>
        <v-tab to="/home/profile">
          Profile
        </v-tab>
        <v-tab to="/home/events">
          My Events
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>
<script>
export default {
  middleware: 'auth',
  head () {
    return {
      title: this.$auth.user.name || ''
    }
  }
}
</script>

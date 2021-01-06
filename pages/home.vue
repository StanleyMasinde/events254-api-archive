<template>
  <v-row justify="center">
    <v-col cols="11" sm="10">
      <h1 class="display-2">
        Hi {{ $auth.user.name }}
      </h1>
    </v-col>
    <v-col cols="12" md="6">
      <v-card flat>
        <v-card-text>
          <v-text-field v-model="$auth.user.name" outlined label="Name" />
          <v-text-field v-model="$auth.user.email" readonly outlined label="Email" />
          <v-text-field v-model="$auth.user.username" outlined label="Username" />
          <v-btn depressed large rounded color="accent">
            Update
          </v-btn>
        </v-card-text>
      </v-card>
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

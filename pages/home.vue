<template>
  <div>
    <h1>Hurray you have been logged in as {{ $auth.user.name }}</h1>
    <v-btn text link to="/">
      Home
    </v-btn>
    <v-btn text link @click="$auth.logout()">
      Logout
    </v-btn>
  </div>
</template>
<script>
export default {
  middleware: 'auth'
}
</script>

<template>
  <div>
    <v-form>
      <v-text-field outlined label="Username or Email" />
      <v-text-field outlined label="Password" />
      <v-btn color="accent">
        Sign in
      </v-btn>
      <v-btn text to="/register" color="primary">
        Sign up
      </v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
  layout: 'auth',
  head: {
    title: 'Sign in',
    description: 'Sign in into your Events254 account'
  }
}
</script>

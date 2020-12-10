<template>
  <div>
    <v-form>
      <v-text-field label="Name" outlined />
      <v-text-field type="email" outlined label="Email" />
      <v-text-field outlined label="Password" />
      <v-btn rounded large color="accent">
        Sign up
      </v-btn>
      <v-btn text to="/login" color="primary">
        Sign in
      </v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
  layout: 'auth',
  head: {
    title: 'Sign up',
    description: 'Sign up into your Events254 account'
  }
}
</script>

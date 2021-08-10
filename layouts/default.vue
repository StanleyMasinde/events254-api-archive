<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>
<script>
export default {
  computed: {
    innitials () {
      if (!this.$auth.user.name) {
        return
      }
      const [firstName, lastName] = this.$auth.user.name.split(' ')
      if (!lastName) {
        return `${firstName.split('')[0]}`
      }
      return `${firstName.split('')[0]}${lastName.split('')[0]}`
    }
  }
}
</script>

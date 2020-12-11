<template>
  <div>
    <v-alert v-if="err" type="error">
      {{ err }}
    </v-alert>
    <h3 class="headline">
      Login
    </h3>
    <br>
    <v-form @submit.prevent="login">
      <v-text-field outlined label="Username or Email" />
      <v-text-field outlined label="Password" />
      <v-btn type="submit" color="accent">
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
  data () {
    return {
      err: null,
      cred: {
        email: null,
        password: null
      }
    }
  },
  head: {
    title: 'Sign in',
    meta: [
      { hid: 'description', name: 'description', content: 'Login into your account' }
    ]
  },
  methods: {
    async login () {
      try {
        await this.$auth.loginWith('local', {
          data: this.cred
        })
        this.$router.push('/home')
      } catch (error) {
        this.error = error.response.data

        setTimeout(() => {
          this.error = null
        }, 5000)
      }
    }
  }
}
</script>

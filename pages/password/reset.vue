<template>
  <div>
    <v-alert v-if="err" type="error">
      {{ err }}
    </v-alert>
    <h3 class="headline">
      Reset Password
    </h3>
    <br>
    <ValidationObserver v-slot="{ invalid }">
      <v-form @submit.prevent="resetPassword()">
        <ValidationProvider name="email" rules="required|email">
          <v-text-field v-model="email" outlined label="Email" />
        </ValidationProvider>
        <v-btn :disabled="invalid" type="submit" color="accent">
          Send Reset Email
        </v-btn>
        <v-btn text to="/login" color="primary">
          Sign In
        </v-btn>
        <v-btn text to="/register" color="primary">
          Sign up
        </v-btn>
      </v-form>
    </ValidationObserver>
  </div>
</template>
<script>
export default {
  auth: 'guest',
  layout: 'auth',
  data () {
    return {
      err: null,
      email: null
    }
  },
  head: {
    title: 'Reset Password',
    meta: [
      { hid: 'description', name: 'description', content: 'Reset Your Password' }
    ]
  },
  methods: {
    async resetPassword () {
      try {
        await this.$axios
          .post('/api/auth/password', { email: this.email })
      } catch (error) {
        this.err = error.response.data
        setTimeout(() => {
          this.err = null
        }, 5000)
      }
    }
  }
}
</script>

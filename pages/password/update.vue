<template>
  <div>
    <v-alert v-if="err" type="error">
      {{ err }}
    </v-alert>
    <h3 class="headline">
      Change Password
    </h3>
    <br>
    <ValidationObserver v-slot="{ invalid }">
      <v-form @submit.prevent="updatePassword">
        <ValidationProvider name="email" rules="required|email">
          <v-text-field v-model="details.email" outlined label="Email" readonly />
        </ValidationProvider>

        <ValidationProvider name="password" rules="required">
          <v-text-field v-model="details.password" outlined label="New Password" />
        </ValidationProvider>
        <v-btn :disabled="invalid" type="submit" color="accent">
          Change Password
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
      details: {
        email: this.$route.query.email,
        token: this.$route.query.token,
        password: null
      }
    }
  },
  head: {
    title: 'Reset Password',
    meta: [
      { hid: 'description', name: 'description', content: 'Reset Your Password' }
    ]
  },
  methods: {
    async updatePassword () {
      try {
        await this.$axios
          .post('/api/auth/password/update', this.details)
        await this.$auth.loginWith('local', {
          data: this.details
        })
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

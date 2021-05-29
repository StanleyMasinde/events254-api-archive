<template>
  <div>
    <client-only>
      <v-alert v-if="err" type="error">
        {{ err }}
      </v-alert>
      <h3 class="headline">
        Login
      </h3>
      <br>
      <ValidationObserver v-slot="{ invalid }">
        <v-form @submit.prevent="login">
          <ValidationProvider name="email" rules="required">
            <v-text-field v-model="cred.email" name="username" outlined label="Username or Email" />
          </ValidationProvider>

          <ValidationProvider name="password" rules="required">
            <v-text-field v-model="cred.password" name="password" type="password" outlined label="Password" />
          </ValidationProvider>
          <v-btn :disabled="invalid" type="submit" color="accent">
            Sign in
          </v-btn>
          <v-btn text to="/register" color="primary">
            Sign up
          </v-btn>
          <v-btn text to="/password/reset" color="primary">
            Did you forget your password?
          </v-btn>
        </v-form>
      </ValidationObserver>
    </client-only>
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
      {
        hid: 'description',
        name: 'description',
        content: 'Login into your Events254 account'
      },
      {
        property: 'og:title',
        content: 'Sign in'
      },
      {
        property: 'og:description',
        content: 'Login into your Events254 account'
      }
    ]
  },
  beforeMount () {
    if (this.$auth.loggedIn) {
      const lastPath = this.$auth.$storage.getCookie('redirect')
      this.$router.push(lastPath)
    }
  },
  auth: 'guest',
  methods: {
    async login () {
      try {
        await this.$auth.loginWith('cookie', { data: this.cred })
        this.$router.push()
      } catch (error) {
        if (error.response.status === 500) {
          throw new Error(error)
        }
        this.err = error.response.data.message
        setTimeout(() => {
          this.err = null
        }, 5000)
      }
    }
  }
}
</script>

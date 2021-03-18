<template>
  <div>
    <h3 class="headline">
      Register
    </h3>
    <br>
    <ValidationObserver ref="form" v-slot="{ invalid }">
      <v-form @submit.prevent="register">
        <ValidationProvider v-slot="{ errors }" name="name" rules="required">
          <v-text-field v-model="user.name" name="name" :error-messages="errors" label="Name" outlined />
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
          <v-text-field
            v-model="user.email"
            name="email"
            :error-messages="errors"
            type="email"
            outlined
            label="Email"
          />
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="password" rules="required">
          <v-text-field
            v-model="user.password"
            name="password"
            type="password"
            :error-messages="errors"
            outlined
            label="Password"
          />
        </ValidationProvider>

        <v-btn :disabled="invalid" type="submit" rounded large color="accent">
          Sign up
        </v-btn>
        <v-btn text to="/login" color="primary">
          Sign in
        </v-btn>
        <v-btn text to="/password/reset" color="primary">
          Did you forget your password?
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
      user: {
        name: null,
        email: null,
        password: null
      }
    }
  },
  head: {
    title: 'Sign up',
    meta: [
      { hid: 'description', name: 'description', content: 'Create a new account' }
    ]
  },
  methods: {
    async register () {
      try {
        await this.$axios.post('/api/auth/register', this.user)
        await this.$auth.loginWith('local', {
          data: this.user
        })
        this.$router.push('/home')
      } catch (error) {
        if (error.response.status === 422) {
          this.$refs.form.setErrors(error.response.data.errors)
          return
        }
        // TODO add proper handling
        throw new Error(error)
      }
    }
  }
}
</script>

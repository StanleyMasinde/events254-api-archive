<template>
  <v-container>
    <v-row v-if="$fetchState.pending" justify="center">
      <h1>Loading</h1>
    </v-row>

    <!-- Something went wrong! 😭 -->
    <v-row v-else-if="$fetchState.error">
      <div class="full-height">
        <v-img height="300" contain src="/not_found.svg">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="8">
                <h1 class="display-1 gray--text">
                  Sorry 😢 There's nothing here
                </h1>
                <v-btn text x-large color="primary" to="/">
                  Go home
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </div>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <v-avatar
          height="200"
          width="200"
          color="brown"
        >
          <span class="white--text display-4">{{ innitials }}</span>
        </v-avatar>
      </v-col>
      <v-col cols="12" md="8">
        <v-card rounded flat>
          <v-card-text class="text-center">
            <h1>{{ user.name }}</h1>
            {{ user.bio }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      user: {}
    }
  },
  async fetch () {
    try {
      const res = await this.$http.get(`/api/users/${this.$route.params.id}`)
      this.user = await res.json()
    } catch (error) {
      throw new Error(error)
    }
  },
  head () {
    return {
      title: this.user.name || 'Events254'
    }
  },
  auth: false,
  computed: {
    innitials () {
      if (!this.user.name) {
        return
      }
      const [firstName, lastName] = this.user.name.split(' ')
      if (!lastName) {
        return `${firstName.split('')[0]}`
      }
      return `${firstName.split('')[0]}${lastName.split('')[0]}`
    }
  }
}
</script>

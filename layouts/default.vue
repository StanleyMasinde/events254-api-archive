<template>
  <v-app>
    <v-app-bar flat app>
      <v-toolbar-items>
        <nuxt-link to="/">
          <v-img height="70" width="70" src="/icon.png" />
        </nuxt-link>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-menu
          v-if="$auth.loggedIn"
          bottom
          nudge-top
          min-width="200px"
          rounded
          offset-y
        >
          <template #activator="{ on }">
            <v-btn
              data-profile-menu
              icon
              x-large
              v-on="on"
            >
              <v-avatar
                color="brown"
                size="48"
              >
                <span class="white--text headline">{{ innitials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar
                  color="brown"
                >
                  <span class="white--text headline">{{ innitials }}</span>
                </v-avatar>
                <h3>{{ $auth.user.name }}</h3>
                <p class="caption mt-1">
                  {{ $auth.user.email }}
                </p>
                <v-divider class="my-3" />
                <v-btn
                  to="/"
                  depressed
                  rounded
                  text
                >
                  Home
                </v-btn>
                <v-divider class="my-3" />
                <v-btn
                  to="/home"
                  depressed
                  rounded
                  text
                >
                  My account
                </v-btn>
                <v-divider class="my-3" />
                <v-btn
                  data-start-your-group
                  to="/groups/create"
                  depressed
                  rounded
                  text
                >
                  Start your group
                </v-btn>
                <v-divider class="my-3" />

                <v-btn
                  to="/events/create"
                  depressed
                  rounded
                  text
                >
                  Create event
                </v-btn>
                <v-divider class="my-3" />
                <v-btn
                  color="error"
                  depressed
                  rounded
                  text
                  @click="$auth.logout()"
                >
                  Logout
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
        <template v-else>
          <v-btn text link to="/login">
            Login
          </v-btn>
          <v-btn text link to="/register">
            Register
          </v-btn>
        </template>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
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
      return `${firstName.split('')[0]}${lastName.split('')[0]}`
    }
  }
}
</script>

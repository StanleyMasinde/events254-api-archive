<template>
  <v-app>
    <v-app-bar flat app>
      <v-toolbar-title>Events254</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn v-if="$auth.loggedIn" text to="/home">
          {{ $auth.user.name }}
        </v-btn>
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
      <nuxt />
    </v-main>
    <v-footer>
      &copy; opensource254 2020
    </v-footer>
  </v-app>
</template>

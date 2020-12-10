<template>
  <v-app dark>
    <v-main>
      <v-img :src="error.statusCode === 404 ? '/not_found.svg': '/500.svg'">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8">
              <h1 v-if="error.statusCode === 404" class="display-2 gray--text">
                {{ pageNotFound }}
              </h1>
              <h1 v-else>
                {{ otherError }}
              </h1>
              <v-btn text x-large color="primary" to="/">
                Go home
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </v-main>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

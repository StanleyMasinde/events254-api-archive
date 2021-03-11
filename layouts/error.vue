<template>
  <v-app dark>
    <v-main>
      <div class="full-height">
        <v-img height="400" contain :src="error.statusCode === 404 ? '/not_found.svg': '/500.svg'">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="8">
                <h1 v-if="error.statusCode === 404" class="display-1 gray--text">
                  {{ pageNotFound }}
                </h1>
                <h1 v-else class="display-1 gray--text">
                  {{ otherError }}
                </h1>
                <v-btn text x-large color="primary" to="/">
                  Go home
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </div>
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
<style scoped>
.full-height {
  height: 50vh!important;
}
</style>

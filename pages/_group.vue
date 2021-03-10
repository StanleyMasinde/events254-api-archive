<template>
  <div>
    <!-- Still loading the group information -->
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

    <!-- We found the group 😎 -->
    <v-row v-else justify="center">
      <v-col cols="12" md="5">
        <v-img height="400" :src="group.pictureUrl" />
      </v-col>
      <v-col cols="12" md="5">
        <v-card outlined>
          <v-card-title>
            <h1 class="display-1">
              {{ group.name }}
            </h1>
          </v-card-title>
          <v-card-text>
            <h3><v-icon>mdi-map-marker</v-icon> {{ group.city }}, {{ group.country }} </h3>
            <h3><v-icon>mdi-account-group</v-icon> Members 0</h3>
            <h3><v-icon>mdi-account</v-icon> Managed by {{ group.organisers[0].name }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="10">
        <v-tabs>
          <v-tab>About</v-tab>
          <v-tab :to="`/${$route.params.group}/events`">
            Events
          </v-tab>
          <v-tab :to="`/${$route.params.group}/members`">
            Members
          </v-tab>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <h1>About {{ group.name }}</h1>
                <p class="body-1">
                  {{ group.description }}
                </p>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
        <nuxt-child />
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      group: {}
    }
  },
  async fetch () {
    const { data } = await this.$axios.get(`/api/groups/${this.$route.params.group}`)
    this.group = data
  },
  head () {
    return {
      title: this.group.name
    }
  }
}
</script>

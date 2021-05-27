<template>
  <v-container>
    <v-row justify="center">
      <v-card class="sticky-top" flat>
        <v-col cols="12">
          <h1 class="headline">
            {{ group.name }} : Members
          </h1>
        </v-col>
        <v-col cols="12">
          <v-btn color="primary" icon text :to="`/${$route.params.company}`">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
      </v-card>
    </v-row>

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

    <v-row v-else justify="center">
      <v-col cols="12" md="8">
        <v-list shaped dense>
          <v-list-item v-for="(m, i) in members" :key="i" :to="`/u/${m.userId}`">
            <v-list-item-avatar>
              <v-avatar color="brown" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <h3>{{ m.name }}</h3>
              </v-list-item-title>
              <v-list-item-subtitle class="body-1">
                <span class="subtitle">{{ m.bio }}</span> <br>
                <i>Member since: {{ $moment(m.memberSince).format('Do MMMM YYYY') }}</i>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12">
        <h1 v-if="members.length === 0" class="display-1">
          This group has no members
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  auth: false,
  data () {
    return {
      group: {},
      members: []
    }
  },
  async fetch () {
    if (process.client) {
      this.$http.setBaseURL(process.env.APP_URL)
    }
    const company = await this.$http.get(
      `/api/groups/${this.$route.params.company}`
    )
    const members = await this.$http.get(
      `/api/groups/${this.$route.params.company}/members`
    )
    this.members = await members.json()
    this.group = await company.json()
  },
  head () {
    return {
      title: `${this.group.name} - members`
    }
  }
}
</script>

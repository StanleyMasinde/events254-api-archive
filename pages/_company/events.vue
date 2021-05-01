<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="headline">
          {{ group.name }} - Events
        </h1>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" icon text :to="`/${$route.params.company}`">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="12" md="10">
        <v-tabs grow>
          <v-tab :to="`/${$route.params.company}/events/all`">
            All
          </v-tab>
          <v-tab :to="`/${$route.params.company}/events/upcoming`">
            Upcoming
          </v-tab>
          <v-tab :to="`/${$route.params.company}/events/past`">
            Past
          </v-tab>
          <v-tab v-if="group.isManager" :to="`/${$route.params.company}/events/create`">
            Create
          </v-tab>
        </v-tabs>
        <nuxt-child />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  auth: false,
  data () {
    return {
      group: {}
    }
  },
  async fetch () {
    const { data } = await this.$axios.get(
      `/api/groups/${this.$route.params.company}`
    )
    this.group = data
  },
  head () {
    return {
      title: `${this.group.name} - Events`
    }
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="display-1">
          {{ group.name }} - Members
        </h1>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" icon text :to="`/${$route.params.company}`">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="12" md="8">
        <h1>Members here</h1>
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
    const { data } = await this.$axios.get(`/api/groups/${this.$route.params.company}`)
    this.group = data
  },
  head () {
    return {
      title: `${this.group.name} - members`
    }
  }
}
</script>

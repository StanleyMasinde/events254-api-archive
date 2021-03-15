<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-btn color="primary" text :to="`/${$route.params.company}`">
        Back to {{ group.name }}
      </v-btn>
    </v-col>

    <v-col cols="12" md="8">
      <CreateEvent :create-url="`/api/groups/${group.slug}/events`" />
    </v-col>
  </v-row>
</template>
<script>
export default {
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
      title: `${this.group.name} - Events`
    }
  }
}
</script>

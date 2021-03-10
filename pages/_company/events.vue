<template>
  <h1>{{ group.name }} Events Page</h1>
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

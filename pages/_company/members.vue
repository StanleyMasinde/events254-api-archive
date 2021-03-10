<template>
  <h1>{{ group.name }} Members Page</h1>
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
      title: `${this.group.name} - members`
    }
  }
}
</script>

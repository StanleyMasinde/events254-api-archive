<template>
  <div class="page">
    <client-only>
      <Ticket :ticket="ticket" />
    </client-only>
  </div>
</template>
<script>
export default {
  layout: 'print',
  data () {
    return {
      ticket: {}
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get(
        `/api/tickets/${this.$route.params.id}`
      )
      this.ticket = data

      // print after 3 seconds
      // eslint-disable-next-line nuxt/no-timing-in-fetch-data
      setTimeout(() => {
        window.print()
      }, 3000)
    } catch (error) {
      throw new Error(error).stack
    }
  }
}
</script>

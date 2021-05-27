<template>
  <div class="page">
    <Ticket :ticket="ticket" />
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
    } catch (error) {
      throw new Error(error)
    }
  },
  mounted () {
    setTimeout(() => {
      print()
    }, 3000)
  }
}
</script>

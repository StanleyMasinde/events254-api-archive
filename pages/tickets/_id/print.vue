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
<style lang="scss" scoped>
div {
  &.page {
    width: 21cm;
    min-height: 29.7cm;
    padding: 2cm;
    margin: 1cm auto;
    border: 1px #d3d3d3 solid;
    border-radius: 5px;
    background: white;
    box-shadow: 0 0 5px #0000001a;
  }
}
</style>

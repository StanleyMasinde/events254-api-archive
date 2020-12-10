<template>
  <h1 class="headline">
    Events254
  </h1>
</template>
<script>
export default {
  async fetch () {
    try {
      await this.$axiod.get
    } catch (error) {
      throw new Error(error)
    }
  }
}
</script>

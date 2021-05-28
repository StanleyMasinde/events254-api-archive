<template>
  <v-menu v-model="isActive" :close-on-content-click="false" max-width="290">
    <template #activator="{ on, attrs }">
      <v-text-field
        filled
        rounded
        :value="computedDateFormattedMomentjs"
        clearable
        :placeholder="label"
        readonly
        v-bind="attrs"
        v-on="on"
        @click:clear="date = null"
      />
    </template>
    <v-date-picker v-model="date" @change="isActive = false" />
  </v-menu>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Date'
    }
  },
  data () {
    return {
      isActive: false,
      date: ''
    }
  },

  computed: {
    computedDateFormattedMomentjs () {
      return this.date
        ? this.$moment(this.date).format('dddd, MMMM Do YYYY')
        : ''
    }
  }
}
</script>

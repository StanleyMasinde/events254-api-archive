<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <ValidationProvider v-slot="{ errors }" :name="label" rules="required">
        <v-text-field
          v-model="date"
          data-date-input
          :error-messages="errors"
          outlined
          :label="label"
          readonly
          v-bind="attrs"
          type="date"
          v-on="on"
        />
      </ValidationProvider>
    </template>
    <v-date-picker
      ref="picker"
      v-model="date"
      :min="new Date().toISOString().substr(0, 10)"
    >
      <v-spacer />
      <v-btn text color="primary" @click="menu = false">
        Cancel
      </v-btn>
      <v-btn data-save-date text color="primary" @click="$refs.menu.save(date)">
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Date'
    },
    label: {
      type: String,
      default: 'Date'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      menu: false
    }
  },
  computed: {
    date: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    }
  },
  watch: {
    date (newDate) {
      this.$emit('input', newDate)
    }
  }
}
</script>

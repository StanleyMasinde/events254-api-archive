<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        filled
        rounded
        data-time-input
        :placeholder="label"
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-time-picker
      ref="picker"
      v-model="time"
    >
      <v-spacer />
      <v-btn
        text
        color="primary"
        @click="menu = false"
      >
        Cancel
      </v-btn>
      <v-btn
        data-save-time
        text
        color="primary"
        @click="$refs.menu.save(time)"
      >
        OK
      </v-btn>
    </v-time-picker>
  </v-menu>
</template>
<script>
export default {
  props: {
    inputName: {
      type: String,
      default: 'time'
    },
    label: {
      type: String,
      default: 'Time'
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    time: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    }
  },
  watch: {
    time (newtime) {
      this.$emit('input', newtime)
    }
  }
}
</script>

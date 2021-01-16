<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <ValidationProvider v-slot="{errors}" :name="label" rules="required">
        <v-text-field
          v-model="time"
          :error-messages="errors"
          type="time"
          outlined
          :label="label"
          readonly
          v-bind="attrs"
          v-on="on"
        />
      </ValidationProvider>
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
    label: {
      type: String,
      default: 'Time'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      time: null
    }
  },
  watch: {
    time (newtime) {
      this.$emit('input', newtime)
    }
  }
}
</script>

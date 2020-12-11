import Vue from 'vue'
import { required, email, confirmed, min } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'

extend('required', {
  ...required,
  message: '{_field_} is required'
})

extend('email', {
  ...email,
  message: 'Email must be valid'
})

extend('confirmed', {
  ...confirmed,
  message: '{_field_} confirmation does not match'
})

extend('phone-min', {
  ...min,
  message: 'This phone number does not look valid'
})

extend('delivery-address-required', {
  ...required,
  message: 'This address is required'
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

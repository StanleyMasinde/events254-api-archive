<template>
  <v-row justify="center">
    <v-col cols="12">
      <h1 class="display-1">
        Start a new group
      </h1>
    </v-col>
    <v-col cols="12" md="7">
      <v-card flat>
        <v-card-text>
          <ValidationObserver ref="formObserver" v-slot="{ invalid }">
            <v-form id="groupForm" @submit.prevent="createGroup">
              <ValidationProvider ref="form" v-slot="{ errors }" name="picture" rules="required">
                <v-file-input
                  v-model="group.picture"
                  name="picture"
                  :error-messages="errors"
                  accept="image/*"
                  label="Your group image"
                  hint="This would appear in the profile"
                  outlined
                />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" name="name" rules="required">
                <v-text-field
                  v-model="group.name"
                  name="name"
                  :error-messages="errors"
                  label="Name your group"
                  outlined
                />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" name="description" rules="required">
                <v-textarea
                  v-model="group.description"
                  name="description"
                  :error-messages="errors"
                  outlined
                  label="What is your group about?"
                />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" name="country" rules="required">
                <v-text-field
                  v-model="group.country"
                  name="country"
                  :error-messages="errors"
                  readonly
                  label="Country"
                  outlined
                />
              </ValidationProvider>

              <ValidationProvider v-slot="{ errors }" name="city" rules="required">
                <v-text-field v-model="group.city" name="city" :error-messages="errors" outlined label="City" />
              </ValidationProvider>
              <v-btn type="submit" color="primary" :disabled="invalid">
                Create group
              </v-btn>
            </v-form>
          </ValidationObserver>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data () {
    return {
      group: {
        picture: null,
        name: null,
        description: null,
        country: 'Kenya',
        city: 'Nairobi'
      }
    }
  },
  head () {
    return {
      title: 'Create group/company'
    }
  },
  methods: {
    async createGroup () {
      const form = document.querySelector('#groupForm')
      const groupData = new FormData(form)
      try {
        const { data } = await this.$axios.post('/api/groups', groupData)
        this.$router.push(`/${data.slug}`)
      } catch (error) {
        if (error.response.status === 422) {
          return this.$refs.formObserver.setErrors(error.response.data.errors)
        }
        throw new Error(error)
      }
    }
  }
}
</script>

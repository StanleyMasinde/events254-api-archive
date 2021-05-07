<template>
  <v-card-actions>
    <!-- Edit group button -->
    <v-btn data-edit-group depressed color="primary" @click="editDialog = true">
      <v-icon>mdi-pencil-outline</v-icon>
      Edit info
    </v-btn>

    <!-- Delete group dialog -->
    <v-btn
      depressed
      outlined
      color="error"
      @click="deleteDialog = true"
    >
      <v-icon>mdi-delete</v-icon>
      Delete group
    </v-btn>

    <!-- The modal to edit a group -->
    <v-dialog v-model="editDialog" width="500">
      <v-card>
        <v-card-title>
          <h1 class="headline">
            Editing {{ group.name }}
          </h1>
        </v-card-title>
        <v-card-text>
          <ValidationObserver ref="formObserver" v-slot="{ invalid }">
            <v-form id="groupForm" @submit.prevent="updateGroup">
              <ValidationProvider
                ref="form"
                v-slot="{ errors }"
                name="picture"
                rules=""
              >
                <v-file-input
                  v-model="group.picture"
                  name="picture"
                  :error-messages="errors"
                  accept="image/*"
                  label="Your group image"
                  hint="Not required"
                  outlined
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                name="name"
                rules="required"
              >
                <v-text-field
                  v-model="group.name"
                  name="name"
                  :error-messages="errors"
                  label="Name your group"
                  outlined
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                name="description"
                rules="required"
              >
                <v-textarea
                  v-model="group.description"
                  name="description"
                  :error-messages="errors"
                  outlined
                  label="What is your group about?"
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                name="country"
                rules="required"
              >
                <v-text-field
                  v-model="group.country"
                  name="country"
                  :error-messages="errors"
                  readonly
                  label="Country"
                  outlined
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                name="city"
                rules="required"
              >
                <v-text-field
                  v-model="group.city"
                  name="city"
                  :error-messages="errors"
                  outlined
                  label="City"
                />
              </ValidationProvider>
              <v-btn type="submit" color="primary" :disabled="invalid">
                Update
              </v-btn>
            </v-form>
          </ValidationObserver>
        </v-card-text>
        <v-card-text />
      </v-card>
    </v-dialog>

    <!-- The modal dialog to delete a group -->
    <v-dialog v-model="deleteDialog" origin="bottom right" width="500">
      <v-card>
        <v-card-title> Delete Confirmation </v-card-title>
        <v-card-text>
          <h2>Are your sure you want to delete {{ group.name }}?</h2>
          <h3>This action is irreversible</h3>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" depressed @click="deleteGroup">
            Yes delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card-actions>
</template>
<script>
export default {
  props: {
    currentGroup: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      group: {},
      editDialog: false,
      deleteDialog: false
    }
  },
  mounted () {
    this.group = this.currentGroup
  },
  methods: {
    async deleteGroup () {
      try {
        await this.$axios.delete(`/api/groups/${this.$route.params.group}`)
        this.$router.push('/')
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateGroup () {
      const form = document.querySelector('#groupForm')
      const groupData = new FormData(form)
      try {
        const { data } = await this.$axios.put(
          `/api/groups/${this.$route.params.group}`,
          groupData
        )
        this.$router.push(data.slug)
        // this.$fetch()
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
</script>

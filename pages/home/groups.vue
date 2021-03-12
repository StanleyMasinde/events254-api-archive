<template>
  <v-container>
    <v-row v-if="groups.length === 0">
      <v-col cols="12">
        <div class="text-center">
          <p class="title">
            You have not created any groups
          </p>
          <v-btn to="/groups/create" depressed rounded color="primary">
            Create your first event
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row v-else justify="center">
      <v-col
        v-for="(g,i) in groups"
        :key="i"
        cols="12"
        md="6"
      >
        <v-card
          :to="`/${g.slug}`"
          outlined
          class="mb-1"
        >
          <v-img height="150" :src="g.pictureUrl" />
          <v-card-title>
            {{ g.name }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      groups: []
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get('/api/groups/currentUser')
      this.groups = data
    } catch (error) {
      throw new Error(error)
    }
  }
}
</script>

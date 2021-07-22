<template>
  <v-container>
    <client-only>
      <FetchLoading v-if="$fetchState.pending" event-page />
      <FetchError v-else-if="$fetchState.error" />

      <!-- We found the group 😎 -->
      <v-row v-else>
        <v-col cols="12" md="8">
          <v-card flat>
            <v-img height="300" :src="group.pictureUrl" />
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card outlined>
            <v-card-title>
              <h1 class="display-1">
                {{ group.name }}
              </h1>
            </v-card-title>
            <v-card-text>
              <h3>
                <v-icon>mdi-map-marker</v-icon> {{ group.city }},
                {{ group.country }}
              </h3>
              <h3><v-icon>mdi-account-group</v-icon> Members {{ group.memberCount }}</h3>
              <h3>
                <v-icon>mdi-account</v-icon> Managed by
                {{ getGroupMangersString(group.organisers) }}
              </h3>
            </v-card-text>
            <v-card-actions v-if="!group.isManager">
              <v-btn
                v-if="!group.isMember"
                depressed
                large
                rounded
                color="primary"
                @click="joinGroup"
              >
                Join this group
              </v-btn>
              <v-btn
                v-else
                text
                depressed
                large
                rounded
                color="primary"
              >
                You are a member of this group
              </v-btn>
            </v-card-actions>
            <EditGroupDialog v-else :current-group="group" />
          </v-card>
        </v-col>
        <v-col class="sticky-top" cols="12" md="8">
          <v-tabs>
            <v-tab>About</v-tab>
            <v-tab :to="`/${$route.params.group}/events/all`">
              Events
            </v-tab>
            <v-tab :to="`/${$route.params.group}/members`">
              Members
            </v-tab>

            <v-tab-item>
              <v-card flat>
                <v-card-text class="body-1">
                  <h1 class="headline">
                    About {{ group.name }}
                  </h1>
                  <p>
                    {{ group.description }}
                  </p>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
          <nuxt-child />
        </v-col>
      </v-row>
    </client-only>
  </v-container>
</template>
<script>
import EditGroupDialog from '~/components/EditGroupDialog.vue'
export default {
  components: { EditGroupDialog },
  auth: false,
  data () {
    return {
      editDialog: false,
      deleteDialog: false,
      group: {}
    }
  },
  async fetch () {
    if (process.client) {
      this.$http.setBaseURL(process.env.APP_URL)
    }
    const res = await this.$http.get(
      `/api/groups/${this.$route.params.group}`
    )
    this.group = await res.json()
  },
  head () {
    return {
      title: this.group.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.group.description || 'Loading group'
        },
        {
          name: 'description',
          content: this.group.description || 'Loading group'
        },
        {
          property: 'og:title',
          content: this.group.name
        },
        {
          property: 'og:description',
          content: this.group.description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.group.pictureUrl
        }
      ]
    }
  },
  methods: {
    async joinGroup () {
      if (!this.$auth.loggedIn) {
        this.$store.state.auth.redirect = this.$router.path
        this.$router.push('/login')
      }

      try {
        await this.$axios.post(`/api/groups/${this.group.slug}/join`)
        this.$router.go()
      } catch (error) {
        throw new Error(error)
      }
    },
    getGroupMangersString (organisers) {
      if (!organisers[0]) {
        return 'N/A'
      }
      // const remaining = organisers.pop()
      return `${organisers[0].name} and ${organisers.length - 1} others`
    }
  }
}
</script>

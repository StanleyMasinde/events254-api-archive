<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="7">
        <v-text-field
          v-model="searchQuery"
          rounded
          outlined
          large
          append-icon="mdi-magnify"
          @click:append="search"
        />
      </v-col>
      <v-col cols="12" md="7">
        <v-tabs class="title" center-active centered>
          <v-tab>
            <h3>Events {{ searchResults.events.length }} results</h3>
          </v-tab>
          <v-tab-item>
            <v-list v-if="searchResults.events.length > 0" rounded>
              <v-card
                v-for="(e, i) in searchResults.events"
                :key="i"
                :to="`/events/${e.id}`"
                class="ma-2"
                outlined
                rounded
              >
                <v-list-item>
                  <v-list-item-avatar tile>
                    <v-img :src="e.image" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ e.about }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $moment(e.startDate).format('MMMM Do YYYY [at] h:mm a') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-list>
            <h3 v-else>
              No events were found matching {{ searchQuery }}
            </h3>
          </v-tab-item>

          <v-tab>
            <h3>Groups {{ searchResults.groups.length }} results</h3>
          </v-tab>

          <v-tab-item>
            <v-list v-if="searchResults.groups.length > 0" rounded>
              <v-card
                v-for="(g, i) in searchResults.groups"
                :key="i"
                :to="`/${g.slug}`"
                class="ma-2"
                outlined
              >
                <v-list-item>
                  <v-list-item-avatar tile>
                    <v-img :src="g.pictureUrl" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ g.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ g.city }}, {{ g.country }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-list>
            <h3 v-else>
              No groups were found matching {{ searchQuery }}
            </h3>
          </v-tab-item>

          <v-tab>
            <h3>Users {{ searchResults.users.length }} results</h3>
          </v-tab>

          <v-tab-item>
            <v-list v-if="searchResults.users.length > 0" rounded>
              <v-card v-for="(u, i) in searchResults.users" :key="i" :to="`/u/${u.id}`" class="ma-2" outlined>
                <v-list-item shaped>
                  <v-list-item-avatar>
                    <v-avatar color="brown" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ u.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ u.bio }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-list>
            <h3 v-else>
              No users were found matching {{ searchQuery }}
            </h3>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      searchQuery: null,
      searchResults: {
        events: [],
        groups: [],
        users: []
      }
    }
  },
  async fetch () {
    try {
      const { data } = await this.$axios.get(`/api/search/?q=${this.searchQuery || this.$route.query.q}`)
      this.searchResults = data
    } catch (error) {
      throw new Error(error)
    }
  },
  auth: false,
  watchQuery (newQuery) {
    this.$fetch()
  },
  mounted () {
    this.searchQuery = this.$route.query.q
  },
  methods: {
    search () {
      this.$router.replace(`/search?q=${this.searchQuery}`)
    }
  }
}
</script>

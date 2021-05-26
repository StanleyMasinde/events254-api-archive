<template>
  <v-container fluid>
    <v-row v-if="landingPage" justify="center">
      <v-col cols="12" md="8">
        <v-row>
          <v-col
            v-for="n in 6"
            :key="n"
            cols="12"
            md="4"
            sm="6"
          >
            <v-skeleton-loader
              class="ma-2"
              v-bind="attrs"
              type="card: card-heading, image, card-heading, text@2"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="eventPage" justify="center">
      <v-col cols="12" md="10">
        <v-row>
          <v-col
            cols="12"
            md="8"
          >
            <v-skeleton-loader
              v-bind="attrs"
              type="heading, image"
            />
          </v-col>
          <v-col class="sticky-top" cols="12" md="4">
            <v-skeleton-loader type="text@4, button" />
          </v-col>

          <v-row>
            <v-col cols="12" md="8">
              <v-skeleton-loader type="text" />
            </v-col>
          </v-row>
        </v-row>
      </v-col>
    </v-row>

    <!-- <v-col
        cols="12"
        md="4"
      >
        <v-skeleton-loader
          v-bind="attrs"
          type="article, actions"
        />

        <v-skeleton-loader
          v-bind="attrs"
          type="table-heading, list-item-two-line, image, table-tfoot"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-skeleton-loader
          v-bind="attrs"
          type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
        />

        <v-skeleton-loader
          v-bind="attrs"
          type="list-item-avatar-three-line, image, article"
        />
      </v-col> -->
  </v-container>
</template>
<script>
export default {
  props: {
    landingPage: {
      type: Boolean,
      default: false
    },
    eventPage: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      attrs: {
        class: 'mb-6',
        boilerplate: false,
        elevation: 0
      }
    }
  }
}
</script>

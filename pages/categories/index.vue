<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(e, i) in eventCategories"
        :key="i"
        sm="6"
        md="4"
        cols="12"
      >
        <v-card flat>
          <v-img
            contain
            gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
            height="80"
            :src="e.image"
          >
            <v-row
              no-gutters
              justify="center"
              align="center"
              style="height: 100%"
            >
              <v-col class="text-center white--text">
                <h1 class="title">
                  {{ e.name }}
                </h1>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      eventCategories: [
        {
          id: 1,
          name: 'General',
          image: 'https://res.cloudinary.com/streetcoder/image/upload/v1628589266/events254/undraw_special_event_4aj8_mfr8rp.svg'
        },
        {
          id: 2,
          name: 'Music',
          image: 'https://res.cloudinary.com/streetcoder/image/upload/v1628589266/events254/undraw_Music_re_a2jk_ixnbvy.svg'
        },
        {
          id: 3,
          name: 'Dance',
          image: 'https://res.cloudinary.com/streetcoder/image/upload/v1628589266/events254/undraw_workout_gcgu_meujil.svg'
        },
        {
          id: 4,
          name: 'Art',
          image: 'https://res.cloudinary.com/streetcoder/image/upload/v1628589266/events254/undraw_art_museum_8or4_pd70rr.svg'
        },
        {
          id: 5,
          name: 'Online',
          image: 'https://res.cloudinary.com/streetcoder/image/upload/v1628589831/events254/undraw_Online_page_re_lhgx_l5xr01.svg'
        },
        {
          id: 6,
          name: 'Literature',
          image: 'https://res.cloudinary.com/streetcoder/image/upload/v1628589266/events254/undraw_Books_l33t_sdmi6k.svg'
        }
      ]
    }
  }
}
</script>

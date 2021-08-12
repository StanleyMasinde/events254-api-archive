<template>
  <div>
    <v-btn icon color="primary" large @click="share">
      <v-icon>mdi-share-variant</v-icon>
    </v-btn>

    <v-bottom-sheet v-model="customShare" inset>
      <v-card flat>
        <v-card-title>
          Share event
        </v-card-title>
        <v-card-text>
          <v-btn color="#1da1f2" x-large icon @click="manualShare('twitter')">
            <v-icon>
              mdi-twitter
            </v-icon>
          </v-btn>

          <v-btn color="#4267B2" x-large icon @click="manualShare('facebook')">
            <v-icon>
              mdi-facebook
            </v-icon>
          </v-btn>

          <v-btn color="#F9A825" x-large icon @click="manualShare('email')">
            <v-icon>
              mdi-email
            </v-icon>
          </v-btn>

          <v-btn color="#4ac959" x-large icon @click="manualShare('whatsapp')">
            <v-icon>
              mdi-whatsapp
            </v-icon>
          </v-btn>

          <v-btn color="#4267B2" x-large icon @click="manualShare('telegram')">
            <v-icon>
              mdi-telegram
            </v-icon>
          </v-btn>

          <v-btn color="#2867b2" x-large icon @click="manualShare('linkedin')">
            <v-icon>
              mdi-linkedin
            </v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Share'
    },
    url: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    via: {
      type: String,
      default: 'events254'
    },
    hashtags: {
      type: Array,
      default: () => ['Events254', 'EventsKe']
    },
    to: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      default: ''
    },
    body: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      customShare: false,
      fullUrl: `${process.env.APP_URL}${this.url}`
    }
  },
  methods: {
    manualShare (network) {
      switch (network) {
        case 'email':
          window.open(`mailto:?subject=${this.title}&body=${this.description}'&to=${this.to}`)
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.fullUrl}`)
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${this.title}&url=${this.fullUrl}&via=${this.via}&hashtags=${this.hashtags.join(',')}`)
          break
        // case 'pinterest':
        //   window.open('https://pinterest.com/pin/create/button/?url=' + this.url + '&media=' + this.image + '&description=' + this.description + '&description=' + this.description)
        //   break
        case 'linkedin':
          window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${this.fullUrl}&title=${this.title}&summary=${this.description}&source=${this.via}`)
          break
        case 'whatsapp':
          window.open(`https://api.whatsapp.com/send?text=${this.title}%20${this.fullUrl}`)
          break
        case 'telegram':
          window.open(`https://telegram.me/share/url?url=${this.fullUrl}&text=${this.title}`)
          break
        default:
          break
      }
    },
    async share () {
      if (!navigator.share) {
        this.customShare = true
        return
      }
      try {
        await navigator.share({
          title: this.title,
          text: this.description,
          url: `${process.env.APP_URL}/events/${this.fullUrl}`
        })
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
</script>

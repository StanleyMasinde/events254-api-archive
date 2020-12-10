<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="fullPage" justify="center">
          <v-col cols="12" md="4">
            <v-img height="300" contain alt="Events254 Logo" src="/icon.png" @click="$router.push('/')" />
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer>
      &copy; opensource254 2020
    </v-footer>
  </v-app>
</template>
<style lang="scss" scoped>
.fullPage {
  height: 90vh;
}
</style>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="fullPage" justify="center" align="center">
          <v-col cols="10" md="6">
            <v-img height="300" contain alt="Events254 Logo" src="/lighthouse.svg" @click="$router.push('/')" />
          </v-col>
          <v-col cols="10" md="6">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<style lang="scss" scoped>
.fullPage {
  height: 90vh;
}
</style>

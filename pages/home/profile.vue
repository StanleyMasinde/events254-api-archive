<template>
  <v-card flat>
    <v-card-text>
      <v-text-field v-model="$auth.user.name" outlined label="Name" />
      <v-text-field v-model="$auth.user.email" readonly outlined label="Email" />
      <v-text-field v-model="$auth.user.username" outlined label="Username" />
      <v-btn depressed large rounded color="accent">
        Update
      </v-btn>
    </v-card-text>
  </v-card>
</template>

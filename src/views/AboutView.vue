<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="mx-auto text-center pa-6">
          <v-card-title class="text-h4 font-weight-bold">About</v-card-title>
          <v-card-text>
            <p class="text-body-1">This is an about page for the Crusade Companion app.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

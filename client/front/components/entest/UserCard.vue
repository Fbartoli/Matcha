<template>
  <v-card class="mx-auto" max-width="400">
    <v-card-title>{{ userUsername }}</v-card-title>
    <v-card-subtitle>{{ userSex }}</v-card-subtitle>
    <v-card-text>{{ userDescription }}</v-card-text>
    <v-card-actions>
      <v-spacer />
      <slot name="button" />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      default: null
    },
    sex: {
      type: String,
      default: null
    },
    preferences: {
      type: Array,
      default: () => ['Female', 'Male', 'Bi']
    }
  }
}
</script>

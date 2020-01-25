<template>
  <v-dialog v-model="open" max-width="500px">
    <v-card class="p-5">
      <v-card-title>New User</v-card-title>
      <v-form>
        <v-select v-model="preference" :items="preferencies" label="Select a preference" />
        <v-text-field v-model="username" label="Choose a username !" />
        <v-text-field v-model="sex" label="What is your sex?" />
        <v-textarea v-model="description" label="Enter Book Description" />
      </v-form>
      <v-card-actions>
        <v-spacer />
        <v-btn
          @click.stop="saveUser"
          color="green"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      preference: '',
      username: '',
      sex: '',
      description: '',
      preferences: ['Female', 'Male', 'Bi']
    }
  }
}
</script>

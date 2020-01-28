<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <!-- <p v-if="userId == ''">To access a specific user, enter a userId and click the button:</p>
        <p v-else>Type a userId first before to press the button</p> -->
        <!-- <input
          v-model="userId"
          type="text"
        /> -->
        <v-card-title
          class="headline"
        >
          Admin page
        </v-card-title>
        <v-card-text>
          <p
            v-if="username"
          >
            Hello, {{ user.username }}
          </p>
          <p
            v-else
          >
            The user is not authenticated!
          </p>
        </v-card-text>
        <button
          v-on="listeners"
          @click="OnLoadUser"
        >
          BUTTON (prevent empty field )> Go to the user corresponding to this userId
        </button>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            nuxt
            to="/"
          >
            Main Page
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      userId: ''
    }
  },
  computed: {
    user () {
      return (this.$store.state.auth || {}).user || null
    },
    listeners () {
      if (this.userId !== '') {
        return { click: this.OnLoadUser }
      }
      return null
    }
  },
  methods: {
    OnLoadUser () {
      this.$router.push('/users/' + this.userId)
    }
  }
}
</script>

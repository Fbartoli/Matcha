<template>
  <div>
    <div v-if="checker === true">
      <br>
      <br>
      Link activated !
    </div>
    <div v-else>
      This link is invalid.
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
    }
  },
  computed: {
    checker () {
      return this.$store.getters['user/checker']
    },
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    }
  },
  async asyncData (context) {
    context.store.dispatch('user/setChecker', false)
    const activated = await axios
      .get(process.env.serverUrl + '/users/activate', {
        params: {
          id: context.query.id
        }
      })
      .then((response) => {
        if (response.status === 200 || response.status === '200') {
          context.store.dispatch('user/setChecker', true)
          context.store.dispatch('interact/setMessage', response.data.client)
          context.redirect('/')
        }
      })
      // eslint-disable-next-line
      .catch(function (error) {
      })
    return {
      activated
    }
  }
}
</script>

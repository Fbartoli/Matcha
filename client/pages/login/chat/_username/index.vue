<template>
  <div>
    <v-container
      class="font-weight-black purple--text text--lighten-5"
    >
      <br>Chat room with {{ target }}
    </v-container>
    <div>
      <br>
      <v-form
        ref="form"
        @submit.prevent="sendChatMessage"
        lazy-validation
      >
        <v-container>
          <v-row>
            <v-col
              cols="10"
            >
              <div>
                <v-text-field
                  v-model.trim="chatMessage"
                  @keyup.13="sendChatMessage"
                  counter="42"
                  label="Type your message"
                  required
                />
                <input v-on:keyup.enter="sendChatMessage">
              </div>
            </v-col>
          </v-row>
          <br>
          <v-row>
            <v-col>
              <v-btn
                @click="sendChatMessage"
                color="purple accent-4"
                class="mr-4 purple--text text--lighten-5"
              >
                Send Message !
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
    <v-list
      subheader
      two-line
      style="background-color: transparent"
    >
      <v-list-item
        v-for="(itemChatHistory, arrayLine) in loadedChatHistory"
        :key="arrayLine"
      >
        <v-row
          v-if="itemChatHistory.username == target"
        >
          <v-col cols="2" />
          <v-col cols="10">
            <v-list-item-content>
              <v-list-item-subtitle>{{ itemChatHistory.username }}:</v-list-item-subtitle>
              <v-list-item-title>{{ itemChatHistory.message_text }}</v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
        <v-row
          v-else
        >
          <v-col>
            <v-list-item-content>
              <v-list-item-subtitle>{{ itemChatHistory.username }}:</v-list-item-subtitle>
              <v-list-item-title>{{ itemChatHistory.message_text }}</v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
    <v-list
      subheader
      style="background-color: transparent"
    >
      <v-list-item
        v-for="(itemChat, arrayLine) in chatListener"
        :key="arrayLine"
      >
        <v-row
          v-if="itemChat.split(':', 1)[0] == target"
        >
          <v-col cols="2" />
          <v-col cols="10">
            <v-list-item-content>
              <v-list-item-subtitle>
                {{ itemChat.split(':', 1)[0] }}:
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ itemChat.split(/^\w+:/, 2)[1] }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
        <v-row
          v-else
        >
          <v-col>
            <v-list-item-content>
              <v-list-item-subtitle>
                {{ itemChat.split(':', 1)[0] }}:
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ itemChat.split(/^\w+:/, 2)[1] }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import axios from 'axios'
import socket from '~/plugins/socket.io.js'

/* eslint-disable */
export default {
  middleware: 'authenticated',
  data () {
    return {
      target: this.$route.params.username,
      // conversationId: this.$route.params.username.conversationId,
      login: {
        username: '',
        password: ''
      },
      chatMessage: '',
      chatListener: [],
      // chatRules: [
      //   v => !!v || 'Username is required',
      //   // v => v.length >= 3 || 'Pass must be more than 3 characters',
      //   v => (v && v.length <= 20) || 'Password must be less than 20 characters',
      //   v => /.{3,}/.test(v) || '3 characters minimum.',
      //   v => /^[a-zA-Z0-9_.-]*$/.test(v) || 'Must be alphanumeric characters [Abc123...]'
      // ]
      passwordVisible: false
    }
  },
  computed: {
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    },
    loadedUsers () {
      return this.$store.getters['user/loadedUsers']
    },
    loadedChatHistory () {
      return this.$store.getters['interact/loadedChatHistory']
    },
    loadedMatchList () {
      return this.$store.getters['search/loadedMatchList']
    }
  },
  created () {
    // window.onbeforeunload = () => {
    //   socket.emit('disconnect', this.username)
    // }
    socket.on('chat', (data) => {
      this.chatListener.push(data)
    })
  },
  async asyncData (context) {
    const matchDiscussion = await context.store.getters['search/loadedMatchList'].filter(function (matchData) {
      return matchData.username === context.route.params.username
    })
    const conversationHistory = await axios
      .get(process.env.serverUrl + '/social/messages', {
        params: {
          conversation_id: matchDiscussion[0].conversationId,
        },
        headers: {
          Authorization: 'Bearer ' + context.app.store.getters['user/token']
        }
      })
      .then((response) => {
        context.store.dispatch('interact/setChatHistory', response.data.client)
      })
      .catch((error) => {
      })
    return {
      matchDiscussion,
      conversationHistory
    }
  },
  methods: {
    sendChatMessage () {
      socket.emit('chat', this.loadedUsers.username, this.target, this.chatMessage)
      this.chatMessage = ''
    }
  }
}
</script>

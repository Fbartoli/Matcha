<template>
  <div class="container">
    <article>
      <h1
        class="username"
      >
        Hello_Wolrd H1 --users
        <!-- {{ user.username }} -->
      </h1>
      <!-- <p>{{ user.sex }}</p> -->
    </article>
    <!-- <aside>
      <h3>People that fit your tastes</h3>
      <ul>
        <li v-for="(related, idUser) in relatedUsers" :key="idUser">
          <nuxt-link :to="{name: 'users-id', params: {id: related.id}}">
            {{ related.title }}
          </nuxt-link>
        </li>
      </ul>
    </aside> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // id: this.$route.params.id,
      users: [
        {
          id: '777',
          title: 'wolverine',
          content: 'I never cut my nails and I love spamming cat gif'
        }
      ]
    }
  },
  // computed: {
  //   user () {
  //     return this.users.find(user => user.id === this.id)
  //   },
  //   relatedUsers () {
  //     return this.users.filter(user => user.id !== this.id)
  //   }
  // }
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: space-between;
    line-height: 1.5;
  }

  article * {
    margin-bottom: 1rem;
  }

  aside {
    min-width: 280px;
    max-width: 280px;
    padding-left: 2rem;
  }

  .title {
    font-size: 2rem;
  }
</style>

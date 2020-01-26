<template>
  <div>
    <section>
      <form>
        <div>
          If I am connected...
          <br>
          My id = {{ loadedAuth.id }}
          <br>
          My username = {{ loadedAuth.username }}
          <br>
          My password = {{ loadedAuth.password }}
          <br>
          My name = {{ loadedAuth.name }}
          <br>
          My surname = {{ loadedAuth.surname }}
          <br>
          My token = {{ loadedAuth.token }}
          <br>
          My email = {{ loadedAuth.email }}
          <br>
          My birth_date = {{ loadedAuth.birth_date }}
          <br>
          My location = {{ loadedAuth.location }}
          <br>
          My photo = {{ loadedAuth.photo }}
          <br>
          <br>
        </div>
        <AppControlInput
          type="text"
        >
          test_A
        </AppControlInput>
        <AppControlInput
          type="password"
        >
          test_B
        </AppControlInput>
        <AppButton
          type="submit"
        >
          test_Valid
        </AppButton>
        <AppButton
          type="button"
          btn-style="inverted"
          style="margin-left: 10px"
        >
          ... button waiting in the future...
        </AppButton>
      </form>
    </section>
  </div>
</template>

<script>
import AppControlInput from '@/components/UI/AppControlInput'
import AppButton from '@/components/UI/AppButton'

export default {
  components: {
    AppControlInput,
    AppButton
  },
  asyncData (context, callback) {
    callback(null, {
      loadedAuth: {
        id: '888',
        username: 'user_888',
        password: 'secretcryptomagicpass',
        name: 'name_888',
        surname: 'surname_888',
        token: 'token_888',
        email: 'email888@888_testmatcha.fr',
        birth_date: '01/04/2000',
        location: '',
        photo: ''
      }
    })
  }
}

// data() {
//   return {
//     isLogin: true
//   }
// }
</script>

<style scoped>
.admin-auth-page {
  padding: 20px;
}

.auth-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 2px #ccc;
  width: 300px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>

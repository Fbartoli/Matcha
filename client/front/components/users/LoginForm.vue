<template>
  <form @submit.prevent="onSave">
    <AppControlInput v-model="checkAuth.username">Username</AppControlInput>
    <AppControlInput v-model="checkAuth.password">Password</AppControlInput>
    <AppButton type="submit">Valid</AppButton>
    <AppButton
      type="button"
      style="margin-left: 10px"
      btn-style="cancel"
      @click="onCancel"
    >
      Cancel
    </AppButton>
  </form>
</template>

<script>
import AppControlInput from "@/components/UI/AppControlInput";
import AppButton from "@/components/UI/AppButton";

export default {
  components: {
    AppControlInput,
    AppButton
  },
  props: {
    logging: {
      type: Object,
      required: false,
      default: () => {
      }
    }
  },
  data() {
    return {
      checkAuth: this.logging

      // spread operator: pull out all the properties of the bound object
      // we'receiving and past it in a new object, else defaut object given.
        ? { ...this.logging }
        : {
            username: "",
            password: ""
          }
    };
  },
  methods: {
    onSave() {
      // Save the post
      /* eslint-disable */
      // console.log(this.checkAuth)
      this.$emit ('submit', this.checkAuth)
    },
    onCancel() {
      // Navigate back
      this.$router.push("/");
    }
  }
};
</script>

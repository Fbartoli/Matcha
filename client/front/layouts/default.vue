<template>
  <div class="container">
    <TheBackground>
      <TheNavbar />
      <nuxt />
      <TheFooter />
    </TheBackground>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TheFooter from '@/components/TheFooter'
import TheBackground from '@/components/TheBackground'

export default {
  components: {
    TheNavbar,
    TheFooter,
    TheBackground
  }
}
</script>

<style>

/* .container {
  background-color: hsla(0, 100%, 90%, 0.1);
  background-color: #fff5f5;
  opacity: 0.1;
  z-index: -9;
} */
</style>

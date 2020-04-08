<template>
  <div class="TheFooter">
    <v-footer class="pa-3 white" elevation-2 light>
      <h6
        headline
      >
        fbartoli & msaubin © {{ new Date().getFullYear() }}
      </h6>
      <v-spacer />
      <img class="footer--pic" src="/doubleheart.png">
    </v-footer>
  </div>
</template>

<style scoped>
h6{
  margin-top: 20px;
}

.TheFooter {
  z-index: 4;
}

.footer--pic{
  width: auto;
  height: 50px;
}
@media all and (max-width: 600px)
{
  .footer--pic{
    width: auto;
    height: 25px;
  }
}
</style>

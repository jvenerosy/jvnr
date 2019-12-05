<template>
  <div id="app" class="app">
    <Home />
  </div>
</template>

<script>

import Home from './components/Home.vue';

export default {
  name: 'app',
  components: {
    Home,
  },
};
</script>

<style lang="scss">
  @import 'styles/main';
</style>

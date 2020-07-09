<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  created () {
    let UA = navigator.userAgent
    if (UA.indexOf('iPhone') > -1 || UA.indexOf('Android') > -1) {
      this.SET_IS_MOBILE(true)
    }
  },
  methods: {
    ...mapMutations([
      'SET_IS_MOBILE'
    ])
  }
}
</script>

<style>
</style>

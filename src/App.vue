<template>
  <v-app>
    <transition>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {

    }
  }
}
</script>

<template>
    <div>
      <router-link to="/">Home</router-link> |
      <router-link to="/app">App</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/user">User</router-link> |
      <div @click="enterLogout">Logout</div> |
    </div>
</template>

<script>
import State from '../../services/state'
export default {
  name: "AppNavBar",
  methods: {
    enterLogout() {
      State.token = ""
      State.isLogin = false
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
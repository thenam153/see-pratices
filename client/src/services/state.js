import Vue from 'vue'
const state = Vue.observable({
    token: localStorage.getItem('token') || "",
    isLogin: true
})

export default state;
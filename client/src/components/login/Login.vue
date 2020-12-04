<template>
    <div>
        <div>
            Login
            Tài khoản
            <input type="text" v-model="username" >
            Mật khẩu
            <input type="password" v-model="password" >
            <input type="submit" @click="enterLogin()">
        </div>
        <div>
            Register
            Email
            <input type="email" v-model="emailRegister" >
            Tài khoản
            <input type="text" v-model="usernameRegister"> 
            Mật khẩu
            <input type="text" v-model="passwordRegister">
            <input type="submit" @click="enterRegister()">
        </div>
    </div>
</template>

<script>
import State from '../../services/state'

export default {
    name: 'Login',
    mounted() {
        this.State = State
    },
    data() {
        return {
            username: "",
            password: "",
            emailRegister: "",
            usernameRegister: "",
            passwordRegister: ""
        }
    },
    methods: {
        enterLogin() {
            this.axios.post('http://localhost:3000/login', {
                username: this.username,
                password: this.password
            })
            .then(res => {
                console.log(res.data.content)
                let code = res.data.code;
                if(code == 200) {
                    State.token = res.data.content.token
                    State.isLogin = true
                    this.$router.push({ path: '/app' })
                }   
            })
        },
        enterRegister() {
            this.axios.post('http://localhost:3000/register', {
                username: this.usernameRegister,
                password: this.passwordRegister,
                email: this.emailRegister
            })
            .then(res => {
                let code = res.data.code;
                if(code == 200) {
                    State.token = res.data.content.token
                    State.isLogin = true
                    this.$router.push({ path: '/app' })
                }   
            })
        }
    }
}
</script>
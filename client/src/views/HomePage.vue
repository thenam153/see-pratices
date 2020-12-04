<template>
    <div>
        Home
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    name: "HomePage",
    mounted() {
        this.dialog = Vue.dialog
    },
    methods: {
        hello() {
            this.dialog.alert('Request completed!')
            .then(function(dialog) {
                console.log('Closed');
            })
        },
        hi() {
            this.dialog.alert("Đăng xuất?", {
                    view: 'Hello'
                })
            .then((dialog) => {
                console.log(dialog.data)
                if(dialog.data) {
                    alert("Đăng xuất")
                }else {
                    alert("Chưa đăng xuất")
                }
            })
            .catch((...prams) => {
                console.log(prams)
            })
        }
    }
}
</script>

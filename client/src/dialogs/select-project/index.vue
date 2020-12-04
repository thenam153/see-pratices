<template>
    <div>
        <div>
            <button v-show="!createProject" @click="createProject=!createProject">Create New Project </button> 
            <div v-show="createProject">
                <input type="text" v-model="nameProject">
                <button @click="create()"> create</button>
            </div>
        </div>
        <div>
            <div v-for="(value, index ) in projects" :key="index" @click="selected=value">{{value}}</div>
        </div>

        <!-- {{options}} -->
        <button @click="proceed(false); close();">Cancel</button>
        <button @click="proceed(true); close();" :disabled="!selected">Oke</button>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'
export default {
    mixins: [DialogMixin],
    data() {
        return {
            createProject: false,
            selected: null,
            nameProject: "default",
            projects: [1,2,3,4,5]
        }
    },
    methods: {
        cancel() {
            this.cancel(false)
        },
        ok() {
            this.proceed(true)
        },
        create() {
            this.projects.push(this.nameProject)
        }
    }
}
</script>
<template>
    <div>
        <!-- {{options.message}} -->
        <input type="text" v-model="options.name" />
        <button @click="cancel(); close();">Cancel</button>
        <button @click="proceed(options.name); close();">Oke</button>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'
export default {
    mixins: [DialogMixin]
}
</script>
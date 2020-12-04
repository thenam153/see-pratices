<template>
    <div>
        {{options.message}}

        {{options}}
        <button @click="cancel(false); close();">Cancel</button>
        <button @click="proceed(true); close();">Oke</button>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'
export default {
    mixins: [DialogMixin]
}
</script>
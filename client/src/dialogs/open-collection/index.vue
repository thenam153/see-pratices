<template>
    <div>
        <div>
            <div @click="image=1"> image 1</div>  
            <div @click="image=1"> image 2 </div>  
            <div @click="image=1"> image 3 </div>    
        </div>

        <!-- {{options}} -->
        <button @click="proceed(false); close();">Cancel</button>
        <button :disabled="!image" @click="proceed(this.image); close();">Load</button>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'
export default {
    mixins: [DialogMixin],
    data() {
        return {
            image: null
        }
    },
    methods: {
        cancel() {
            this.cancel(false)
        },
        ok() {
            this.proceed(true)
        }
    }
}
</script>
<template>
    <div style="display: block;width: 100%; height: 100%">
            <div style="width: 60%; height: 80%;display: block; float:left">image</div>
            <div style="display: block; float:left; width: 40%;">
                <input type="text" value="name image">
                export type:
                <select name="" id="">
                    <option value="">png</option>
                    <option value="">gif</option>
                    <option value="">jpg</option>
                </select>
                crop
                <div>
                    x:
                    <input type="text" value="0">
                    y:
                    <input type="text" value="0">
                </div>
                width height
                <div>
                    x:
                    <input type="text" value="0">
                    y:
                    <input type="text" value="0">
                </div>
            </div>
            
                 
        <!-- {{options}} -->
        <button @click="proceed(false); close();">Cancel</button>
        <button :disabled="!image" @click="proceed(this.image); close();">Load</button>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'
import './index.css'
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
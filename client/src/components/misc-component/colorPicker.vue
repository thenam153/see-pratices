<template>
    <div>
        <div v-show="!show" @click="click(true)" style="display: block; width: 30px; height: 30px;" :style="{'background-color': value}">
        </div>
        <div v-show="show">
            <div @click="click(false)">
                ok
            </div>
            <chrome-picker  label="Pick Colour" :value="value" @input="update" />
        </div>
    </div>    
</template>

<script>
export default {
    props: [
        "value",
        "updateColor"
    ],
    data() {
        return {
            show: false,
        }
    },
    methods: {
        click(value) {
            this.show = value
        },
        update(data) {
            this.updateColor(data.hex)
        }
    }
}
</script>
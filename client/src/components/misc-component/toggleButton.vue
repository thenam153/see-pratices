<template>
    <div>
        <ToggleButton :value="value" color="#82C7EB" @change="changeValue" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            currentState: false
        }
    },
    props: {
        setValue: {
            type: Function,
        },
        value: {
            type: Boolean
        },
        filter: {
            type: Object
        },
        emit: {
            
        }
    },
    methods: {
        changeValue(obj) {
            this.setValue && this.setValue(obj.value, this.filter)
            if(this.emit) {
                this.$emit(this.emit, obj.value)
            }
        }
    }
}
</script>
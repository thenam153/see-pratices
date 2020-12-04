<template>
    <div>
        <div v-if="isClassic()">
            <div v-if="!hidelabels">
                {{label}}
            </div>
            <div>
                <input type="text" :value="getValue(param, inputId)" @change="setValue(param, getExactValue($event), inputId)">
            </div>
        </div>
        <div v-if="isSlider()">
            <vue-slider :value="value" v-bind="options" @change="changeValue"></vue-slider>
        </div>
        <div v-if="isDropdown()">
            <select  @change="changeValueDropdown" >
                <option v-for="(select, index) in this.options" v-bind:key="index" :selected="select == value">{{select}}</option>
            </select>
        </div>
        <div v-if="isArray()">
            
        </div>
        <div v-if="isToggle()">
            <ToggleButton :value="value" color="#82C7EB" @change="changeValueToggle" />
        </div>
    </div>    
</template>

<script>
export default {
    name: 'Input',
    props: [
            'type', 
            'param', 
            'label', 
            'options', 
            'hidelabels', 
            'placeholder', 
            'setValue', 
            'inputId', 
            'getValue', 
            'value', 
            'filter', 
            'paramOpt',
            'emit'
            ],
    data() {
        return {
            slider: 0
        }
    },
    mounted() {
        this.slider = this.options ? this.options.default : 0
    },
    methods: {
        getExactValue(event) {
            if(this.type == 'number') {
                return Number(event.target.value)
            } 
            return event.target.value
        },
        isClassic() {
            return this.type == 'text' || this.type == 'number' || !this.type
        },
        isSlider() {
            return this.type == 'slider'
        },
        isDropdown() {
            return this.type == 'dropdown';
        },
        isToggle() {
            return this.type == 'toggle';
        },
        isArray() {
            return this.type == 'array';
        },
        changeValue(value) {
            console.log(value)
            this.setValue(this.filter, value, this.paramOpt)
        },
        changeValueToggle(obj) {
            this.setValue(this.paramOpt || this.filter, obj.value)
            if(this.emit) {
                this.$emit(this.emit, obj.value)
            }
        },
        changeValueDropdown(event) {
            this.setValue && this.setValue(this.filter, event.target.value, this.paramOpt)
            this.$emit(this.emit, event.target.value)
        }
    },
    computed: {
       
    }
}
</script>
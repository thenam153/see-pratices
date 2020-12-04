<template>
    <div class="top-area">
        <div>
            list object
        </div>
        <div>
            <button :disabled="shouldDisableMoveUp()" @click="appConfig.currentFocus.moveUp(); appConfig.currentFocus.getLayer().batchDraw();">Move up</button>
        </div>
        <div>
            <button :disabled="shouldDisableMoveDown()" @click="appConfig.currentFocus.moveDown(); appConfig.currentFocus.getLayer().batchDraw();">Move down</button>
        </div>
        <div>
            rotation
            <button :disabled="!appConfig.currentFocus" @click="rotationLeft()">Left</button>
            <input v-if="appConfig.currentFocus" type="number" step="1" v-model="rotation"      style="max-width: 4em; padding: .5em; border: 1px solid rgba(0,0,0,0.54); border-radius: .25em;">
            <button :disabled="!appConfig.currentFocus" @click="rotationRight()">Right</button>
        </div>
        <div>
            opacity
            <input v-if="appConfig.currentFocus" type="number" step="0.01" max="1" min="0" v-model="opacity" style="max-width: 4em; padding: .5em; border: 1px solid rgba(0,0,0,0.54); border-radius: .25em;">
        </div>
        <div>
            duplicate shape
            <button :disabled="!appConfig.currentFocus" @click="duplicateObject()">Duplicate Shape</button>
        </div>
        <div>
            delete shape
            <button :disabled="!appConfig.currentFocus" @click="removeObject()">Remove</button>
        </div>
        <div style="display: flex;">
            <div>
                <button @click="renameProject">name project</button> 
            </div>
            <div>
                <button @click="openProject">open project</button>
            </div>
            <div>
                <button @click="saveProject">save</button>
            </div>
            <div>
                <button @click="closeProject">close</button>
            </div>
            <div>
                <button @click="exportProject">export</button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { Shape } from 'konva'
import { removeAllTransformer, setCurrentFocusedObject } from '../../services/utils'
export default {
    name: 'TopNav',
    props: {
        appConfig: Object
    },
    created() {
        this.dialog = Vue.dialog
    },
    methods: {
        removeObject() {
            const _layer = this.appConfig.currentFocus.getLayer()
            this.appConfig.currentFocus.remove()
            this.appConfig.currentFocus = null
            _layer.batchDraw()
            removeAllTransformer(this.appConfig.stage)
        },
        duplicateObject() {
            const _layer = this.appConfig.currentFocus.getLayer()
            const _object  = this.appConfig.currentFocus.toObject()
            _object.attrs.x = 0
            _object.attrs.y = 0
            _object.attrs.name += "(Copy)"
            
            if(_object.className == 'Image') {
                this.appConfig.listLayer.currentLayer.addImage(_object.src, _object.attrs)
            }else {
                this.appConfig.listLayer.currentLayer.addObject(_object.className, _object.attrs)
            }
        },
        shouldDisableMoveUp() {
            if(!this.appConfig.currentFocus) return true
            if(this.appConfig.listLayer.currentLayer == this.appConfig.listLayer.backgroundLayer) {
                const _shapes = this.appConfig.listLayer.currentLayer.getShapes()
                const _zIndex = this.appConfig.currentFocus.getZIndex()
                if(_zIndex == _shapes.length) return true
                return false
            }else {
                const _shapes = this.appConfig.listLayer.currentLayer.getShapes()
                const _zIndex = this.appConfig.currentFocus.getZIndex()
                if(_zIndex == _shapes.length - 1) return true
                return false
            }
        },
        shouldDisableMoveDown() {
            if(!this.appConfig.currentFocus) return true
            if(this.appConfig.listLayer.currentLayer == this.appConfig.listLayer.backgroundLayer) {
                if(this.appConfig.currentFocus.getZIndex() == 1) return true
                return false
            }else {
                if(this.appConfig.currentFocus.getZIndex() == 0) return true
                return false
            }
        },
        rotationLeft() {
            this.appConfig.currentFocus.rotation(this.appConfig.currentFocus.rotation() - 1)
            this.appConfig.currentFocus.getLayer().batchDraw()
        },
        rotationRight() {
            this.appConfig.currentFocus.rotation(this.appConfig.currentFocus.rotation() + 1)
            this.appConfig.currentFocus.getLayer().batchDraw()
        },
        renameProject() {
            this.dialog.alert("", {
                view: "Rename"
            })
        },
        openProject() {
            this.dialog.alert("", {
                    view: 'SelectProject'
                })
            .then((dialog) => {
            })
            .catch((res) => {
            })
        },
        closeProject() {
            
        },
        saveProject() {

        },
        exportProject() {
            this.dialog.alert("", {
                    view: 'ExportProject'
                })
            .then((dialog) => {
            })
            .catch((res) => {
            })
        }
    },
    computed: {
        rotation: {
            get() {
                return this.appConfig.currentFocus.rotation()
            },
            set(value) {
                console.log(value)
                this.appConfig.currentFocus.rotation(this.appConfig.currentFocus.rotation() + Number(value))
                this.appConfig.currentFocus.getLayer().batchDraw()
            }
        },
        opacity: {
            get() {
                return this.appConfig.currentFocus.opacity()
            },
            set(value) {
                console.log(value)
                this.appConfig.currentFocus.opacity(Number(value))
                this.appConfig.currentFocus.getLayer().batchDraw()
            }
        }
    }
}
</script>

<style scoped>
    .top-area {
        display: flex;
    }
    .top-area div {
        margin-right: 24px;
    }
</style>
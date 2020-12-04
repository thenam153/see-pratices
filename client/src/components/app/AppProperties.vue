<template>
    <div>
        Name Shape 
        <input type="text" placeholder="Shape Name" v-model="name" >
        <div>
            Geometric
            <div>
                X<input type="number" v-model="x">
            </div>
            <div>
                Y<input type="number" v-model="y">
            </div>
            <div v-if="shape.getClassName() != 'Line'">
                Width<input type="number" v-model="width">
            </div>
            <div v-if="shape.getClassName() != 'Line'">
                Height<input type="number" v-model="height">
            </div>

            <div v-if="shape.getGeometricKeys && shape.getGeometricKeys().length">
                Options
                <div v-for="nameAttr in shape.getGeometricKeys()" :key="nameAttr">
                    {{ nameAttr }} <input :type="typeof(shape[nameAttr]())" @change="changeAttr(nameAttr, $event)" v-if="typeof(shape[nameAttr]) == 'function'" :value="shape[nameAttr]()">
                </div>
            </div>
        </div>
        <div>
            Fill & Stroke
            <div>
                Fill
                <div>
                    enable fill
                    <Toggle :emit="'fillEnabled'" :value="shape.fillEnabled()" @fillEnabled="shape.fillEnabled($event); redrawShape()" />
                    <div>
                        <div v-if="shape.fillEnabled()">
                            <button @click="shape.fillEnabled(false); redrawShape();">Off</button>
                        </div>
                        <div v-else>
                            <button @click="shape.fillEnabled(true); redrawShape();">On</button>
                        </div>
                    </div>
                </div>
                <div>
                    shape filter enable
                    <div v-if="shape.fillEnabled()">
                        <ColorPicker :value="shape.fill()" :update-color="updateColorFill" />
                    </div>
                </div>
            </div>
            <div>
                Stroke
                <div>
                    Enable Stroke
                    <Toggle :emit="'strokeEnabled'" :value="shape.strokeEnabled()" @strokeEnabled="shape.strokeEnabled($event); redrawShape()" />
                    <div>
                        <div v-if="shape.strokeEnabled()">
                            <button @click="shape.strokeEnabled(false); redrawShape();">Off</button>
                        </div>
                        <div v-else>
                            <button @click="shape.strokeEnabled(true); redrawShape();">On</button>
                        </div>
                    </div>
                    <div v-if="shape.strokeEnabled()">
                        <div>
                            color picker
                            {{shape.stroke() }} hello
                            <!-- <ColorPicker :value="shape.stroke()" :update-color="updateColorStroke" /> -->
                        </div>
                        <div>
                            Stroke width <input type="number" min="1" max="100" step="0.01"  v-model="strokeWidth">
                            <!-- Dash <input type="text" :value="shape.dash()"> -->
                            Line Join   
                            <Input :type="'dropdown'" :value="shape.lineJoin() || 'miter'" :options="['miter', 'round', 'bevel']" :emit="'lineJoin'" @lineJoin="shape.lineJoin($event); redrawShape()" />
                            Line Cap
                            <Input :type="'dropdown'" :value="shape.lineCap() || 'butt'" :options="['butt', 'round', 'square']" :emit="'lineCap'" @lineCap="shape.lineCap($event); redrawShape()" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div>
                Shadow 
                <div>
                    enable shadow
                    <Toggle :emit="'shadowEnabled'" :value="shape.shadowEnabled()" @shadowEnabled="shape.shadowEnabled($event); redrawShape()" />
                    <div>
                        <div v-if="shape.shadowEnabled()">
                            <button @click="applyToggle('shadowEnabled', false)">Off</button>
                        </div>
                        <div v-if="!shape.shadowEnabled()">
                            <button @click="applyToggle('shadowEnabled', true)">On</button>
                        </div>
                    </div>
                    {{shape.shadowEnabled()}}
                    <div v-if="shape.shadowEnabled()">
                        <div>
                            shadow stroke
                            <button>Yes/No</button>
                        </div>
                        <div>
                            color picker
                        </div>
                        <div>
                            opacity
                            slider 
                        </div>
                        <div>
                            blur 
                            slider
                        </div>
                        <div>
                            shadow offset x <input type="number" v-model="shadowX">
                            shadow offset y <input type="number" v-model="shadowY">
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
        <div v-if="shape.getClassName() == 'Text'">
            Misc
            <div>
                Text <input type="text" v-model="text">
            </div>
            <div>
                Font size <input type="number" v-model="fontSize">
            </div>
            <div>
                Font family not yet implement <input type="text" v-model="fontFamily">
            </div>
            <div>
                Type <input type="text" :value="shape.fontStyle()">
            </div>
            <div>
                Text Decoration <input type="text" :value="shape.textDecoration()">
            </div>
        </div>
        <div>
            Filters
            <ShapeFilter :filter-target="shape" />
        </div>
    </div>
</template>

<script>
import ShapeFilter from './ShapeFilter'
import Input from '../misc-component/input'
import Toggle from '../misc-component/toggleButton'
import ColorPicker from '../misc-component/colorPicker'

export default {
  name: "AppProperties",
  components: {
      ShapeFilter,
      Input,
      Toggle,
      ColorPicker
  },
  props: {
      shape: {
          type: Object,
          require: true
      }
  },
  created() {
      this.console = console
  },
  updated() {
      this.$nextTick(() => {
          console.log("123")
      })
  },
  methods: {
        redrawShape() {
            this.shape.clearCache()
            this.shape.draw()
            this.shape.cache()
            this.shape.getLayer().batchDraw()
        },
        getFonts() {

        },
        loadFont() {

        },
        dashArrToString(dashArr) {
            try {
                return `${dashArr.join(" ")}`;
            } catch(err) {
                return "";
            }
        },
        stringToDashArr(string) {
            try {
                return string.trim().split(" ");
            } catch(err) {
                return [];
            }
        },
        changeAttr(nameAttr, $event) {
            console.log(nameAttr, $event)
            let value = null
            if(typeof(this.shape[nameAttr]()) == 'number') {
                value = $event.target.valueAsNumber
            }else if(typeof(this.shape[nameAttr]()) == 'string') {
                value = $event.target.value
            }
            this.shape[nameAttr](value)
            this.redrawShape()
        },
        applyToggle(filter, value) {
            this.$nextTick(() => {
                this.shape[filter](value)
                console.log(this.shape[filter]())
                this.redrawShape()
            })
        },
        updateColorFill(color) {
            console.log(color)
            this.shape.fill(color)
            this.redrawShape()
        },
        updateColorStroke(color) {
            this.shape.stroke(color)
            this.redrawShape()
        }
    },
    computed: {
        name:{
            get() {
                return this.shape.name()
            },
            set(value) {
                this.shape.name(value)
            }
        },
        x: {
            get() {
                return this.shape.x()
            },
            set(value) {
                this.shape.x(Number(value))
                this.redrawShape()

            }
        },
        y: {
            get() {
                return this.shape.y()

            },
            set(value) {
                this.shape.y(Number(value))
                this.redrawShape()
            }
        },
        width: {
            get() {
                return this.shape.width()
            },
            set(value) {
                this.shape.width(Number(value))
                this.redrawShape()
            }
        },
        height: {
            get() {
                return this.shape.height()
            },
            set(value) {
                this.shape.height(Number(value))
                this.redrawShape()
            }
        },
        shadowX: {
            get() {
                return this.shape.shadowOffsetX()
            },
            set(value) {
                this.shape.shadowOffsetX(Number(value))
                this.redrawShape()
            }
        },
        shadowY: {
            get() {
                return this.shape.shadowOffsetY()
            },
            set(value) {
                this.shape.shadowOffsetY(Number(value))
                this.redrawShape()
            }
        },
        text: {
            get() {
                return this.shape.text()
            },
            set(value) {
                // if(!value) {
                //     value = 'default'
                // }
                this.shape.text(value)
                this.redrawShape()
            }
        },
        fontSize: {
            get() {
                return this.shape.fontSize()
            },
            set(value) {
                this.shape.fontSize(Number(value))
                this.redrawShape()
            }
        },
        fontFamily: {
            get() {
                return this.shape.fontFamily()
            },
            set(value) {
                this.shape.fontFamily(value)
                this.redrawShape()
            }
        },
        strokeWidth: {
            get() {
                return this.shape.strokeWidth()
            },
            set(value) {
                this.shape.strokeWidth(Number(value))
                this.redrawShape()
            }
        },
        shadowEnabled: {
            get() {
                return this.shape.shadowEnabled()
            },
            set(value) {
                this.shape.shadowEnabled(value)
                this.redrawShape()
            }
        }
    }
}
</script>
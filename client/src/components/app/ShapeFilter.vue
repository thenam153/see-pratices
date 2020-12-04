<template>
    <div>
      <div v-for="(filter, index) in getFilters()" :key="filter.name + index">
        <div v-if="filter.type =='single-input'">
          <div>
            {{filter.name}}
            <!-- <Toggle :set-value="applyToggle" :value="hasFilter(filter)" :filter="filter" />
            <ToggleButton :value="hasFilter(filter)" @input="applyToggle($event, filter)" /> -->
            <div>
              <button v-if="hasFilter(filter)" @click="removeFilter(filter)">off</button>
              <button v-if="!hasFilter(filter)" @click="addFilter(filter)">on</button>
            </div>
            <Input v-if="hasFilter(filter)" :type="(filter || {}).inputType" :options="filter.options" :set-value="applyFilter" :value="filterTarget[filter.valueFunc]()" :filter="filter" />
          </div>
        </div>
        <div v-if="filter.type =='toggle-input'">
          Filter toggle
          {{filter.name}}
          <!-- <Toggle :set-value="applyToggle" :value="hasFilter(filter)" :filter="filter" /> -->4
          <div>
              <button v-if="hasFilter(filter)" @click="removeFilter(filter)">off</button>
              <button v-if="!hasFilter(filter)" @click="addFilter(filter)">on</button>
            </div>
        </div>
        <div v-if="filter.type =='multiple-input'">
          Filter multiple
          {{filter.name}}
          <!-- <Toggle :set-value="applyToggle" :value="hasFilter(filter)" :filter="filter" /> -->
          <div>
              <button v-if="hasFilter(filter)" @click="removeFilter(filter)">off</button>
              <button v-if="!hasFilter(filter)" @click="addFilter(filter)">on</button>
            </div>
          <div v-show="hasFilter(filter)" v-for="(value, index) in filter.values" :key="value+index">
            {{value.inputType}}
            <Input v-show="hasFilter(filter)" :type="value.inputType" :options="value.options" :set-value="applyFilter" :value="filterTarget[value.valueFunc]()" :filter="filter" :param-opt="value"/>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Input from '../misc-component/input'
import { Filters } from 'konva'
import Toggle from '../misc-component/toggleButton'
import vueSlider from 'vue-slider-component'

export default {
  name: "ShapeFilter",
  components: {
    Input,
    Toggle,
    vueSlider
  },
  props: {
    filterTarget: {
      type: Object,
      require: true
    }
  },
  methods: {
    getFilters() {
      return [...singleInputFilters, ...multipleInputFilters, ...toggleFilters]
    },
    findFilterIndex(filter) {
      const _filters = this.filterTarget.filters() || [];
      if (_filters.length) {
        const _filterIdx = _filters.findIndex(filterClass => filterClass == Filters[filter.name]);
        return _filterIdx;
      }
      return -1;
    },
    hasFilter(filter) {
      return this.findFilterIndex(filter) == -1 ? false : true;
    },
    applyFilter(filter, newValue, options) {
      console.log('Change')
      if(filter.type == 'single-input') {
        // single input value
        if(options && options.useFilter) {
          this.addFilter(filter);
          // this.filterTarget[filter.valueFunc](newValue);
        } else if(options && !options.useFilter) {
          this.removeFilter(filter);
        } 
        else {
          this.filterTarget[filter.valueFunc](newValue);
        }
      } else if(filter.type == 'toggle-input') {
        //toggle filters
        if(newValue) {
          this.addFilter(filter);
        } else {
          this.removeFilter(filter);
        }
      } else if(filter.type == 'multiple-input') {
        // multiple input filters
        if(options) {
          this.filterTarget[options.valueFunc](newValue);
          this.addFilter(filter);
        } else {
          if(newValue) this.addFilter(filter);
          else this.removeFilter(filter);
        }
      }
      this.reDrawTarget();
    },
    addFilter(filter) {
      if(!this.hasFilter(filter)) {
        const currentFilters = this.filterTarget.filters() || []
        this.filterTarget.filters([...currentFilters, Filters[filter.name]])
      }
      this.reDrawTarget();
    },
    removeFilter(filter) {
      if(this.hasFilter(filter)) {
        let currentFilters = this.filterTarget.filters()
        currentFilters = currentFilters.filter(f => {
          return f != Filters[filter.name]
        })
        this.filterTarget.filters(currentFilters)
      }
      this.reDrawTarget();
    },
    reDrawTarget() {
      this.filterTarget.cache();
      this.filterTarget.getLayer().batchDraw();
    },
    applyToggle(value, filter) {
      // if(filter.type == 'single-filter') {
      //   filter.options.useFilter = value
      // }
      if(value) {
        this.addFilter(filter)
      }else {
        this.removeFilter(filter)
      }
      console.log('Change toggle')
    }
  }
}
const singleInputFilters = [
  {
    name: "Blur",
    type: 'single-input',
    valueFunc: "blurRadius",
    inputType: "slider",
    options: {
      min: 0,
      max: 40,
      interval: 1,
      default: 0,
      showInputBox: true,
      thumbLabel: true
    }
  }, {
    name: "Brighten",
    type: 'single-input',
    valueFunc: "brightness",
    inputType: "slider",
    options: {
      min: -1,
      max: 1,
      interval: 0.01,
      default: 0,
      showInputBox: true,
      thumbLabel: true
    }
  }, {
    name: "Contrast",
    type: 'single-input',
    valueFunc: "contrast",
    inputType: 'slider',
    options: {
      min: -100,
      max: 100,
      interval: 0.5,
      default: 0,
      showInputBox: true,
      thumbLabel: true
    }
  }, {
    name: "Enhance",
    type: 'single-input',
    valueFunc: "enhance",
    inputType: 'slider',
    options: {
      min: -1,
      max: 1,
      interval: 0.05,
      default: 0,
      showInputBox: true,
      thumbLabel: true
    }
  }, {
    name: "Noise",
    type: 'single-input',
    valueFunc: "noise",
    inputType: 'slider',
    options: {
      min: 0,
      max: 1,
      interval: 0.01,
      default: 0,
      showInputBox: true,
      thumbLabel: true
    }
  }, {
    name: "Posterize",
    type: 'single-input',
    valueFunc: "levels",
    inputType: 'slider',
    options: {
      min: 0,
      max: 1,
      interval: 0.01,
      default: 0,
      showInputBox: true,
      thumbLabel: true
    }
  }, {
    name: "Pixelate",
    type: 'single-input',
    valueFunc: "pixelSize",
    inputType: 'slider',
    options: {
      min: 0,
      max: 20,
      interval: 1,
      default: 1,
      showInputBox: true,
      thumbLabel: true
    }
  }
];

const multipleInputFilters = [
  {
    name: "Emboss",
    type: 'multiple-input',
    inputType: "toggle",
    values: [
      {
        name: "Strength",
        valueFunc: "embossStrength",
        inputType: "slider",
        options: {
          min: 0,
          max: 1,
          interval: 0.1,
          showInputBox: true,
          thumbLabel: true
        }
      }, {
        name: "White Level",
        valueFunc: "embossWhiteLevel",
        inputType: "slider",
        options: {
          min: 0,
          max: 1,
          interval: 0.1,
          showInputBox: true,
          thumbLabel: true
        }
      }, 
      {
        name: "Direction",
        valueFunc: "embossDirection",
        inputType: "dropdown",
        options: ["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"]
      }, 
      {
        name: "Blend",
        valueFunc: "embossBlend",
        inputType: "toggle"
      }
    ]
  }, {
    name: "RGB",
    type: 'multiple-input',
    inputType: "toggle",
    values: [
      {
        name: "Red",
        valueFunc: "red",
        inputType: "slider",
        options: {
          min: 0,
          max: 255,
          interval: 1,
          showInputBox: true,
          thumbLabel: true
        }
      }, {
        name: "Green",
        valueFunc: "green",
        inputType: "slider",
        options: {
          min: 0,
          max: 255,
          interval: 1,
          showInputBox: true,
          thumbLabel: true
        }
      }, {
        name: "Blue",
        valueFunc: "blue",
        inputType: "slider",
        options: {
          min: 0,
          max: 255,
          interval: 1,
          showInputBox: true,
          thumbLabel: true
        }
      }
    ]
  }, {
    name: "HSL",
    type: 'multiple-input',
    inputType: "toggle",
    values: [
      {
        name: "Hue",
        valueFunc: "hue",
        inputType: "slider",
        options: {
          min: 0,
          max: 359,
          interval: 1,
          showInputBox: true,
          thumbLabel: true
        }
      }, {
        name: "Saturation",
        valueFunc: "saturation",
        inputType: "slider",
        options: {
          min: -10,
          max: 10,
          interval: 0.1,
          showInputBox: true,
          thumbLabel: true
        }
      }, {
        name: "Luminance",
        valueFunc: "luminance",
        inputType: "slider",
        options: {
          min: -2,
          max: 2,
          interval: 0.1,
          showInputBox: true,
          thumbLabel: true
        }
      }
    ]
  }, {
    name: "HSV",
    type: 'multiple-input',
    inputType: "toggle",
    values: [
      {
        name: "Hue",
        valueFunc: "hue",
        inputType: "slider",
        options: {
          min: 0,
          max: 359,
          interval: 1,
          showInputBox: true,
          thumbLabel: true
        }
      }, {
        name: "Saturation",
        valueFunc: "saturation",
        inputType: "slider",
        options: {
          min: -10,
          max: 10,
          interval: 0.1,
          showInputBox: true,
          thumbLabel: true
        }
      }, {
        name: "Value",
        valueFunc: "value",
        inputType: "slider",
        options: {
          min: -10,
          max: 10,
          interval: 0.1,
          showInputBox: true,
          thumbLabel: true
        }
      }
    ]
  }
];

const toggleFilters = [
  {
    name: "Invert",
    type: 'toggle-input',
    inputType: "toggle",
    default: false
  }, {
    name: "Grayscale",
    type: 'toggle-input',
    inputType: "toggle",
    default: false
  }
];
</script>
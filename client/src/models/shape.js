import { Circle as _circle, Rect as _rect, Ellipse as _ellipse, Wedge as _wedge, RegularPolygon as _regPolygon, Star as _star, Image as _image, Line as _line, Text as _text, Filters } from "konva"
import { get } from "lodash"
// export base
export { Circle, Rect, Ellipse, Wedge, RegularPolygon, Star, Image, Line, Text }
// filter konva
const availableFilters = ["Blur", "Brighten", "Contrast", "Enhance", "Noise", "Posterize",
    "Pixelate", "Emboss", "RGB", "HSL", "Invert", "Grayscale", "Kaleidoscope"]

function getFiltersClassName(shape) {
    const filters = shape.filters()
    return availableFilters.filter(className => filters.find(f => f === Filters[className] ))
}

const defaultConfigs = {
    x: 0, 
    y: 0, 
    draggable: true, 
    strokeEnabled: false, 
    fillEnabled: true 
}

function getRandomHash() {
    return "#" + Math.random().toString(36).substr(2, 6)
}

function getRandomColor() {
    return "#" + Math.random().toString(16).substr(2, 6)
}

function _exportJSON() {
    const JSONObj = JSON.parse(this.toJSON())
    if (JSONObj.attrs.filters && JSONObj.attrs.filters.length) {
        JSONObj.attrs.filters = getFiltersClassName(this)
    }
    JSONObj.attrs.strokeEnabled = this.strokeEnabled()
    JSONObj.attrs.fillEnabled = this.fillEnabled()
    JSONObj.attrs.shadowEnabled = this.shadowEnabled()
    return JSONObj
}

class Circle extends _circle {
    constructor(shapeJson) {
        super({
            ...defaultConfigs,
            radius: 100,
            name: getRandomHash(),
            fill: getRandomColor(),
            ...get(shapeJson, 'attrs', {})
        })
        let filters = []
        get(shapeJson, 'attrs.filters', []).forEach(filterClassName => {
            filters.push(Filters[filterClassName])
        })
        this.filters(filters)
    }
    getGeometricKeys() {
        return ["radius"]
    }
    export() {
        return _exportJSON.apply(this)
    }
}

class Rect extends _rect{
    constructor(shapeJson) {
        super({
            ...defaultConfigs,
            width: 200,
            height: 200,
            name: getRandomHash(),
            fill: getRandomColor(),
            ...get(shapeJson, 'attrs', {})
        })
        let filters = []
        get(shapeJson, 'attrs.filters', []).forEach(filterClassName => {
            filters.push(Filters[filterClassName])
        })
        this.filters(filters)
    }
    getGeometricKeys() {
        return []
    }
    export() {
        return _exportJSON.apply(this)
    }
}

class Ellipse extends _ellipse {
    constructor(shapeJson) {
        super({
            ...defaultConfigs,
            radius: {
                x: 200,
                y: 100
            },
            name: getRandomHash(),
            fill: getRandomColor(),
            ...get(shapeJson, 'attrs', {})
        })
        let filters = []
        get(shapeJson, 'attrs.filters', []).forEach(filterClassName => {
            filters.push(Filters[filterClassName])
        })
        this.filters(filters)
    }
    getGeometricKeys() {
        return ["radiusX", "radiusY"]
    }
    export() {
        return _exportJSON.apply(this)
    }
}

class Wedge extends _wedge {
    constructor(shapeJson) {
        super({
            ...defaultConfigs,
            angle: 60, radius: 100,
            name: getRandomHash(),
            fill: getRandomColor(),
            ...get(shapeJson, 'attrs', {})
        })
    
        let filters = []
        get(shapeJson, 'attrs.filters', []).forEach(filterClassName => {
            filters.push(Filters[filterClassName])
        })
        this.filters(filters)
    }

    getGeometricKeys() {
        return ["angle", "radius"]
    }

    export() {
        return _exportJSON.apply(this)
    }
}

class RegularPolygon extends _regPolygon {
    constructor(shapeJson) {
        super({
            ...defaultConfigs,
            radius: 100,
            sides: 6,
            name: getRandomHash(),
            fill: getRandomColor(),
            ...get(shapeJson, 'attrs', {})
        })
    
        let filters = []
        get(shapeJson, 'attrs.filters', []).forEach(filterClassName => {
            filters.push(Filters[filterClassName])
        })
        this.filters(filters)
    }

    getGeometricKeys() {
        return ["angle", "radius"]
    }

    export() {
        return _exportJSON.apply(this)
    }
}

class Star extends _star {
    constructor(shapeJson) {
        super({
            ...defaultConfigs,
            innerRadius: 60,
            outerRadius: 70,
            numPoints: 6,
            name: getRandomHash(),
            fill: getRandomColor(),
            ...get(shapeJson, 'attrs', {})
        })
    
        let filters = []
        get(shapeJson, 'attrs.filters', []).forEach(filterClassName => {
            filters.push(Filters[filterClassName])
        })
        this.filters(filters)
    }

    getGeometricKeys() {
        return ["innerRadius", "outerRadius", "numPoints"]
    }

    export() {
        return _exportJSON.apply(this)
    }
}

class Image extends _image {
    constructor(shapeJson) {
        super({
            ...defaultConfigs,
            name: getRandomHash(),
            fill: getRandomColor(),
            ...get(shapeJson, 'attrs', {})
          });
        const imgSrc = get(shapeJson, 'attrs.imageSource')
        if (imgSrc) {
            const imageEle = document.createElement('img')
            imageEle.crossOrigin = "Anonymous"
            imageEle.onload = () => {
                this.image(imageEle)
                this.cache();
            };
            imageEle.src = imgSrc
        }
        let filters = [];
        get(shapeJson, 'attrs.filters', []).forEach(filterClassName => {
            filters.push(Filters[filterClassName])
        });
        this.filters(filters)
    }
    getGeometricKeys() {
        return [];
    }
    export() {
        const obj = _exportJSON.apply(this);
        obj.attrs.imageSource = this.image().src;
        return obj;
    }
}

class Line extends _line {
    constructor(shapeJson) {
        super({
            ...defaultConfigs,
            name: getRandomHash(),
            fill: getRandomColor(),
            ...get(shapeJson, 'attrs', {})
        })
        let filters = [];
        get(shapeJson, 'attrs.filters', []).forEach(filterClassName => {
            filters.push(Filters[filterClassName]);
        });
        this.filters(filters);
        this.tempPoints = [];
    }
    getGeometricKeys() {
        return [];
    }
    export() {
        return _exportJSON.apply(this);
    }
}

class Text extends _text {
    constructor(shapeJson) {
        super({
            ...defaultConfigs,
            text: "Default text",
            name: getRandomHash(),
            fill: getRandomColor(),
            stroke: getRandomColor(),
            strokeEnabled: true,
            fontSize: 100,
            ...get(shapeJson, 'attrs', {})
        })
        let filters = [];
        get(shapeJson, 'attrs.filters', []).forEach(filterClassName => {
            filters.push(Filters[filterClassName]);
        });
        this.filters(filters);
        this.hasExtraProps = true;
    }
    getGeometricKeys() {
        return [];
    }
    export() {
        return _exportJSON.apply(this);
    }
}
 
import { Layer as _layer, Shape, Transformer, Rect} from 'konva'
import { get } from 'lodash'

import * as shape from './shape'

export class Layer extends _layer {
    constructor(layerJson) {
        super(get(layerJson, 'attrs', {}))
        get(layerJson, 'children', []).forEach(shapeJson => {
            const _class = shape[shapeJson.className]
            if(_class) {
                const _shape = this.addShape(new _class(shapeJson))
                if(_shape.width() && _shape.height()) {
                    _shape.cache()
                }
            }
        })
        this.selectRect = new Rect({
            fill: 'rgba(0,0,255,0.5)',
            visible: false,
            name: "are-selected"
        });
        this.selectTrans = new Transformer()
        this.add(this.selectRect)
        this.add(this.selectTrans)
        this.x1 = 0
        this.y1 = 0
        this.x2 = 0
        this.y2 = 0
    }

    addShape(newShape) {
        newShape.on('transform', () => {
            newShape.width(newShape.width() * newShape.scaleX())
            newShape.height(newShape.height() * newShape.scaleY())
            newShape.scaleX(1)
            newShape.scaleY(1)
            newShape.clearCache()
            newShape.draw()
            newShape.cache()
            newShape.getLayer().batchDraw()
        })
        this.add(newShape)
        return newShape
    }

    addObject(className, props) {
        const newShape = this.createShape(className, props)
        if(newShape) {
            return newShape
        }
        return null
    }

    createShape(className, props) {
        const _class = shape[className]
        if(_class) {
            const _shape = this.addShape(new _class({attrs: props}))
            this.batchDraw()
            return _shape
        }
        return null
    }

    addImage(src, props) {
        let self = this
        const imageElement = document.createElement('img')
        imageElement.crossOrigin = "Anonymous"
        imageElement.onload = function() {
            const _newImage = self.createShape("Image", Object.assign({ image: imageElement}, props || {}))
            _newImage.cache()
            self.add(_newImage)
            self.batchDraw()
        }
        imageElement.src = src
    }
    getShapes() {
        return this.getChildren(c => c instanceof Shape).toArray().reverse()
    }

    isBgLayer() {
        return false
    }

    export() {
        return {
            attrs: JSON.parse(this.toJSON()).attrs,
            children: this.getShapes().reverse().map(_shape => _shape.export()),
            className: 'Layer'
        }
    }
}
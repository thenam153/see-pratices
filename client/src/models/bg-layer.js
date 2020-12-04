import { Layer as _layer } from './layer'
import { Shape } from 'konva'
import { Rect } from './shape'
import { get, cloneDeep } from 'lodash'

export class BgLayer extends _layer {
    constructor(bgLayerJson) {
        super(bgLayerJson || {
            attrs: {
                name: "Background"
            }
        })

        this.bgRect = new Rect(get(bgLayerJson, 'attrs.bgRect', {
            attrs: {
                width: this.width(),
                height: this.height(),
                draggable: false
            },
            children: [],
            className: "Rect"
        }))
        this.bgRect.draggable(false) // firm draggable false
        this.add(this.bgRect)
        this.bgRect.moveToBottom()
    }

    initBackground(config) {
        if(!this.bgRect) {
            this.bgRect = new Rect({
                attrs: {
                    width: config.width || this.width(),
                    height: config.height || this.height(),
                    fill: config.color,
                    draggable: false
                }
            })
            this.add(this.bgRect)
            this.bgRect.moveToBottom()
        }else {
            this.bgRect.width(config.width || this.width())
            this.bgRect.height(config.height || this.height())
            this.bgRect.fill(config.color)
        }
        this.batchDraw()
    }

    updateBackground(config) {
        this.initBackground(config)
    }

    isBgLayer() {
        return true
    }
    getShapes() {
        return this.getChildren(c => c instanceof Shape && c != this.bgRect).toArray().reverse()
    }
    export() {
        let _attrs = JSON.parse(this.toJSON()).attrs
        _attrs.bgRect = cloneDeep(this.bgRect.export())
        return {
            attrs: _attrs,
            children: this.getShapes().reverse().map(_shape => _shape.export()),
            className: 'Layer'
        }
    }
}
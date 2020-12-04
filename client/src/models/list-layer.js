import { Layer } from './layer'
import { BgLayer} from './bg-layer'
import { removeAllTransformer } from '../services/utils'

export class LayerList {
    constructor(config) {
        this.backgroundLayer = new BgLayer(config && config.attrs && config.attrs.backgroundLayer || {})
        this.layerList = []
        config.children.forEach(_layer => {
            this.layerList.push(new Layer(_layer))
        })
        this.currentLayer = this.backgroundLayer
    }
    addLayer(layerName) {
        const newLayer = new Layer({
            attrs: {
                name: layerName,
                draggable: false
            }
        })
        this.layerList.unshift(newLayer)
        this.backgroundLayer.getStage().add(newLayer)
        return newLayer
    }

    removeLayer(layer) {
        const layerIdx = this.layerList.findIndex(l => l == layer);
        if (layerIdx >= 0) {
            if (layer == this.currentLayer) {
                this.currentLayer = this.backgroundLayer;
                removeAllTransformer(this.currentLayer.getStage());
            }
            this.layerList.splice(layerIdx, 1);
        }
        layer.remove();
    }
    export() {
        return {
            attrs: {
                backgroundLayer: this.backgroundLayer.export()
            },
            children: this.layerList.map(layer => layer.export()),
            className: 'LayerList'
        }
    }
}
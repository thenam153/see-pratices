import { LayerList } from './list-layer'
import { Stage } from 'konva'
import { registerStageOnClick, removeAllTransformer, registerStageOnDrawLine, registerStageMultipleSelect, registerStageKeyboard } from '../services/utils'
import {isFinite, get} from 'lodash'

export class AppConfig {
    constructor(project) {
        this.project = project
        const _projectInfo = JSON.parse(project.projectInfo)
        this.mainConfig = _projectInfo.attrs || {
            width: 1440,
            height: 1080,
            color: "rgba(255, 255, 255, 1)"
        }
        this.listLayer = new LayerList(_projectInfo.children)
        this.currentFocus = null
        this.stage = null
        this.mode = null
    }

    initStage(idContainer) {
        this.stage = new Stage({
            container: idContainer,
            width: this.mainConfig.width,
            height: this.mainConfig.height,
            draggable: true
        })
        // compute zoom level
        const _stageContainer = this.stage.container();
        const _containerBoundingClient = _stageContainer.getBoundingClientRect();
        const _diffScaleX = (_containerBoundingClient.width / this.mainConfig.width);
        const _diffScaleY = (_containerBoundingClient.height / this.mainConfig.height);
        const _newScale = Math.min(_diffScaleX, _diffScaleY) * 0.8;
        this.stage.scaleX(_newScale);
        this.stage.scaleY(_newScale);
        this.stage.x((_containerBoundingClient.width - this.mainConfig.width * _newScale) / 2);
        this.stage.y((_containerBoundingClient.height - this.mainConfig.height * _newScale) / 2);
        // mouse wheel handler
        this.stage.on("wheel", (event) => {
            if (event.evt.ctrlKey) {
                event.evt.preventDefault();
                const _additionScale = Math.sign(event.evt.deltaY) * -0.05;
                const _lastScale = this.stage.scaleX();
                let _newScale = _lastScale + _additionScale;
                if (_newScale < 0)
                    _newScale = 0;
                else if (_newScale > 2)
                    _newScale = 2;
                this.changeStageScale(_newScale);
            }
        })
        // 
        this.stage.add(this.listLayer.backgroundLayer)
        this.listLayer.backgroundLayer.initBackground(this.mainConfig)
        this.listLayer.layerList.forEach(l => {
            this.stage.add(l)
        })

        // register event
        registerStageOnClick(this);
        registerStageOnDrawLine(this);
        registerStageMultipleSelect(this);
        registerStageKeyboard(this);
    }
    changeStageScale(event) {
        const _newScale = event;
        const _containerBoundingClient = this.stage.container().getBoundingClientRect();
        this.stage.scaleX(event);
        this.stage.scaleY(event);
        this.stage.x((_containerBoundingClient.width - this.mainConfig.width * _newScale) / 2);
        this.stage.y((_containerBoundingClient.height - this.mainConfig.height * _newScale) / 2);
        this.stage.batchDraw();
    }
    updateMainConfig() {
        this.stage.width(this.mainConfig.width);
        this.stage.height(this.mainConfig.height);
        this.listLayer.backgroundLayer.updateBackground(this.mainConfig);
    }
    toImageURL({ imageName, exportType, exportQuality, x, y, width, height }) {
        removeAllTransformer(this.stage);
        const _lastScale = this.stage.scale();
        const mimeType = exportType ? `image/${exportType}` : "image\\png";
        this.stage.scale({ x: 1, y: 1 });
        this.stage.batchDraw();
        const dataURL = this.stage.toDataURL({
            x: this.stage.x() + (isFinite(x) ? x : 0),
            y: this.stage.y() + (isFinite(y) ? y : 0),
            width: isFinite(width) ? width : this.mainConfig.width,
            height: isFinite(height) ? height : this.mainConfig.height,
            mimeType: mimeType,
            quality: exportQuality
        });
        // return last scale
        this.stage.scale(_lastScale);
        this.stage.batchDraw();
        return dataURL;
    }
    toBlob({ imageName, exportType, exportQuality, x, y, width, height }) {
        removeAllTransformer(this.stage);
        const _lastScale = this.stage.scale();
        this.stage.scale({ x: 1, y: 1 });
        this.stage.batchDraw();
        const _canvas = this.stage.toCanvas({
            callback: function (cv) {
                // console.log(cv);
            },
            x: this.stage.x() + (isFinite(x) ? x : 0),
            y: this.stage.y() + (isFinite(y) ? y : 0),
            width: isFinite(width) ? width : this.mainConfig.width,
            height: isFinite(height) ? height : this.mainConfig.height
        });
        const mimeType = exportType ? `image/${exportType}` : "image\\png";
        // return last scale
        this.stage.scale(_lastScale);
        this.stage.batchDraw();
        return new Promise(resolve => {
            _canvas.toBlob((blob) => {
                resolve(blob);
            }, mimeType, exportQuality || 1);
        });
    }
    saveStageAsImage({ imageName, exportType, exportQuality, x, y, width, height }) {
        this.toBlob({ imageName, exportType, exportQuality, x, y, width, height })
            .then((blob) => {
            const imgURL = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = imageName;
            link.href = imgURL;
            link.click();
            link.remove();
        });
    }
}

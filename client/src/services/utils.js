import { Shape, Transformer, Filters, Rect, Util } from "konva";
import * as _shape from '../models/shape'

export { registerStageOnClick, removeAllTransformer, setCurrentFocusedObject, registerStageOnDrawLine, registerStageMultipleSelect, registerStageKeyboard};

// function loadFontToDocument(fontData, fontName, callback) {
//   const newFontFace = new FontFace(fontName, fontData);
//   newFontFace.load()
//     .then(function (loadedFontFace) {
//       // console.log(loadedFontFace);
//       document.fonts.add(loadedFontFace);
//       callback && callback();
//     })
//     .catch(err => {
//       console.error(err);
//     })
// }

function registerStageOnClick (appConfig) {
  // appConfig.stage.on("click tap", (event) => {
  //   if(["draw-line", "draw-polygon", "multiple-select"].includes(appConfig.mode)) {
  //     removeAllTransformer(appConfig.stage);
  //   } else {
  //     if (event.target == appConfig.stage || event.target == appConfig.listLayer.backgroundLayer.bgRect) {
  //       removeAllTransformer(appConfig.stage);
  //       appConfig.currentFocus = null;
  //       appConfig.stage.batchDraw();
  //     } 
  //     else {
  //       setCurrentFocusedObject(appConfig, event.target);
  //     }
  //   }
  // })
  appConfig.stage.on("click tap", (event) => {
    let _layer = appConfig.listLayer.currentLayer
        if (_layer.selectRect.visible()) {
          return;
        }
        if(["draw-line", "draw-polygon", "multiple-select"].includes(appConfig.mode)) {
          removeAllTransformer(appConfig.stage);
        } else {
          if (event.target == appConfig.stage || event.target == appConfig.listLayer.backgroundLayer.bgRect) {
            removeAllTransformer(appConfig.stage);
            appConfig.currentFocus = null;
            appConfig.stage.batchDraw();
          } 
          else {
            const metaPressed = event.evt.shiftKey || event.evt.ctrlKey || event.evt.metaKey;
            const isSelected = _layer.selectTrans.nodes().indexOf(event.target) >= 0;
            if(!metaPressed && !isSelected) {
              setCurrentFocusedObject(appConfig, event.target);
            }else if (metaPressed && isSelected) {
              const nodes = _layer.selectTrans.nodes().slice();
              nodes.splice(nodes.indexOf(event.target), 1);
              _layer.selectTrans.nodes(nodes);
              if(nodes.length == 1) {
                setCurrentFocusedObject(appConfig, nodes[0])
              }else { 
                appConfig.currentFocus = null;
              }
            } else if (metaPressed && !isSelected) {
              const nodes = _layer.selectTrans.nodes().concat([event.target]);
              _layer.selectTrans.nodes(nodes);
              if(nodes.length == 1) {
                setCurrentFocusedObject(appConfig, nodes[0])
              }else { 
                appConfig.currentFocus = null;
              }
            }
            _layer.draw();
          }
        }
  })

}

function registerStageOnDrawLine(appConfig) {
  let isDrawing = false;
  appConfig.stage.on("mousedown touchstart", () => {
    if(appConfig.mode == "draw-line") {
      setTimeout(() => {
        appConfig.stage.draggable(false)
      })
      console.log("Break draggable")

      isDrawing = true;
    } else if(appConfig.mode == "draw-polygon") {
      setTimeout(() => {
        appConfig.stage.draggable(false)
      })
      console.log("Break draggable")
    }
  })

  appConfig.stage.on("mouseup touchend", () => {
    if(appConfig.mode == "draw-line") {
      appConfig.stage.container().style.cursor = "auto";
      isDrawing = false;
      appConfig.mode = null;
      appConfig.stage.draggable(true);
      console.log("Enable draggable")
      setCurrentFocusedObject(appConfig, appConfig.currentFocus);
    } else if(appConfig.mode == "draw-polygon") {
      removeAllTransformer(appConfig.stage);
      if(appConfig.currentFocus instanceof _shape.Line) {
        const _currObj = appConfig.currentFocus;
        let pos = appConfig.stage.getPointerPosition();
        const _stageScale = appConfig.stage.scale();
        pos.x = (pos.x - appConfig.stage.x()) / _stageScale.x;
        pos.y = (pos.y - appConfig.stage.y()) / _stageScale.y;
        _currObj.tempPoints = [..._currObj.tempPoints, pos.x, pos.y];

        const points = _currObj.tempPoints;
        _currObj.points(points);
        _currObj.getLayer().batchDraw();
      }
    }
  })

  appConfig.stage.on("mousemove touchmove", (event) => {
    const _currObj = appConfig.currentFocus;
    if(["draw-line", "draw-polygon"].includes(appConfig.mode)) {
      appConfig.stage.container().style.cursor = "url('/assets/cursor.cur'), auto";
    }
    if(isDrawing && appConfig.mode == "draw-line" && (_currObj instanceof _shape.Line)) {
      let pos = appConfig.stage.getPointerPosition();
      const _stageScale = appConfig.stage.scale();
      pos.x = (pos.x - appConfig.stage.x()) / _stageScale.x;
      pos.y = (pos.y - appConfig.stage.y()) / _stageScale.y;

      const points = [..._currObj.points(), pos.x, pos.y];
      _currObj.points(points);
      _currObj.getLayer().batchDraw();
    } else if(appConfig.mode == "draw-polygon" && _currObj instanceof _shape.Line) {
      let pos = appConfig.stage.getPointerPosition();
      const _stageScale = appConfig.stage.scale();
      pos.x = (pos.x - appConfig.stage.x()) / _stageScale.x;
      pos.y = (pos.y - appConfig.stage.y()) / _stageScale.y;
      _currObj.points([..._currObj.tempPoints, pos.x, pos.y]);
      _currObj.getLayer().batchDraw();
    }
  })

  window.addEventListener("keyup", function(event) {
    if (event.keyCode == 27 && appConfig.mode == "draw-polygon") {
      appConfig.mode = null;
      appConfig.stage.draggable(true);
      appConfig.stage.container().style.cursor = "auto";
      const _currObj = appConfig.currentFocus;
      if (_currObj && _currObj.getClassName() == "Line") {
        _currObj.draggable(true);
        _currObj.points(_currObj.tempPoints);
        setCurrentFocusedObject(appConfig, _currObj);
      }
    }
    });
}

function setCurrentFocusedObject(appConfig, object) {
  if(object instanceof Shape) {
    const _newLayer = object.getLayer();

    removeAllTransformer(appConfig.stage);
    appConfig.listLayer.currentLayer = _newLayer;
    appConfig.currentFocus = object;

    if(!["draw-line", "draw-polygon"].includes(appConfig.mode)) {
      // const _newTransformer = new Transformer({name: "select-simple"});
      // _newLayer.add(_newTransformer);
      // _newTransformer.nodes([object]);
      _newLayer.selectTrans.moveToTop()
      _newLayer.selectTrans.nodes([object])
    }
  } else {
    removeAllTransformer(appConfig.stage);
    appConfig.currentFocus= null;
  }
  appConfig.stage.batchDraw();
}

function registerStageMultipleSelect(appConfig) {  
  appConfig.stage.on('mousedown touchstart', () => {
    if( appConfig.mode == 'multiple-select') {
      let currentLayer = appConfig.listLayer.currentLayer
      setTimeout(() => {
        appConfig.stage.draggable(false)
      })
      currentLayer.x1 = appConfig.stage.getPointerPosition().x;
      currentLayer.y1 = appConfig.stage.getPointerPosition().y;
      currentLayer.x2 = appConfig.stage.getPointerPosition().x;
      currentLayer.y2 = appConfig.stage.getPointerPosition().y;
      currentLayer.selectRect.visible(true);
      currentLayer.selectRect.width(0);
      currentLayer.selectRect.height(0);
      currentLayer.selectRect.moveToTop()  
      currentLayer.draw();
    }
  })

  appConfig.stage.on('mousemove touchmove', () => {
    if(appConfig.mode != 'multiple-select') return
    let currentLayer = appConfig.listLayer.currentLayer
    if (currentLayer.selectRect.visible() != true) return
    currentLayer.x2 = appConfig.stage.getPointerPosition().x;
    currentLayer.y2 = appConfig.stage.getPointerPosition().y;
    currentLayer.selectRect.setAttrs({
      x: Math.min(currentLayer.x1, currentLayer.x2),
      y: Math.min(currentLayer.y1, currentLayer.y2),
      width: Math.abs(currentLayer.x2 - currentLayer.x1),
      height: Math.abs(currentLayer.y2 - currentLayer.y1),
    });
    currentLayer.batchDraw();
  })

  appConfig.stage.on('mouseup touchend', () => {
    if( appConfig.mode != 'multiple-select') return
    let currentLayer = appConfig.listLayer.currentLayer
    if (!currentLayer.selectRect.visible()) return 
    var shapes = appConfig.listLayer.currentLayer.getChildren().toArray()
    var box = currentLayer.selectRect.getClientRect();
    var selected = shapes.filter((shape, index) =>
      Util.haveIntersection(box, shape.getClientRect()) && index != 0 && shape instanceof Shape && shape.attrs.name != 'are-selected'
    );
    setTimeout(() => {
      removeAllTransformer(appConfig.stage);
      currentLayer.selectTrans.nodes(selected)
      appConfig.listLayer.currentLayer.batchDraw();
      appConfig.stage.draggable(true)
      appConfig.mode = null 
      appConfig.currentFocus = null
      currentLayer.selectRect.visible(false);
    });
  })

  // appConfig.stage.on('click tap', function (e) {
  //     let _layer = appConfig.listLayer.currentLayer
  //     if (_layer.selectRect.visible()) {
  //       return;
  //     }

  //     // if click on empty area - remove all selections
  //     // if (e.target == appConfig.stage) {
  //     //   _layer.selectTrans.nodes([]);
  //     //   _layer.draw();
  //     //   return;
  //     // }

  //     // do nothing if clicked NOT on our rectangles
  //     // if (!e.target.hasName('rect')) {
  //     //   return;
  //     // }

  //     // do we pressed shift or ctrl?
  //     const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
  //     const isSelected = _layer.selectTrans.nodes().indexOf(e.target) >= 0;
  //     if(!metaPressed && !isSelected) {
  //       setCurrentFocusedObject(appConfig, event.target);
  //     }else if (metaPressed && isSelected) {
  //       // if we pressed keys and node was selected
  //       // we need to remove it from selection:
  //       const nodes = _layer.selectTrans.nodes().slice(); // use slice to have new copy of array
  //       // remove node from array
  //       nodes.splice(nodes.indexOf(e.target), 1);
  //       _layer.selectTrans.nodes(nodes);
  //     } else if (metaPressed && !isSelected) {
  //       // add the node into selection
  //       const nodes = _layer.selectTrans.nodes().concat([e.target]);
  //       _layer.selectTrans.nodes(nodes);
  //     }
  //     _layer.draw();
  //   });
}

function removeAllTransformer (stage) {
  stage.find("Transformer").each(tr => { 
    // if(tr.attrs && tr.attrs.name == 'select-simple') tr.destroy();  else tr.nodes([])
    tr.nodes([])
  })
}

function registerStageKeyboard(appConfig) {
  window.addEventListener('keyup', function(e) {
    if(e.keyCode == 46) {
      if(appConfig.currentFocus) {
        let _layer = appConfig.currentFocus.getLayer()
        appConfig.currentFocus.remove()
        _layer.batchDraw()
        appConfig.currentFocus = null
        removeAllTransformer(appConfig.stage)
      }
      else if(appConfig.listLayer.currentLayer.selectTrans && appConfig.listLayer.currentLayer.selectTrans.nodes().length) {
        let nodes = appConfig.listLayer.currentLayer.selectTrans.nodes()
        nodes.forEach(n => {
          n.remove()
        })
        appConfig.listLayer.currentLayer.batchDraw()
        removeAllTransformer(appConfig.stage)
      }
    }
  })
  window.addEventListener('keydown', function(e) {
    if(e.ctrlKey && e.keyCode == 86) {
      appConfig.mode = 'multiple-select'
    }
  })
}
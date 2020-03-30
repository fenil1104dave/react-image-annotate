import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { moveRegion } from "../ImageCanvas/region-tools.js";
import { setIn, updateIn } from "seamless-immutable";
import moment from "moment";
import { Matrix } from "transformation-matrix-js";
import isEqual from "lodash/isEqual";

var getRandomId = function getRandomId() {
  return Math.random().toString().split(".")[1];
};

var getRandomInt = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomColor = function getRandomColor() {
  var h = getRandomInt(0, 360);
  var s = 100;
  var l = 50;
  return "hsl(".concat(h, ",").concat(s, "%,").concat(l, "%)");
};

var typesToSaveWithHistory = {
  BEGIN_BOX_TRANSFORM: "Transform/Move Box",
  BEGIN_CIRCLE_TRANSFORM: "Transform/Move Circle",
  BEGIN_MOVE_POINT: "Move Point",
  DELETE_REGION: "Delete Region"
};
export default (function (state, action) {
  if (!action.type.includes("MOUSE")) {
    state = setIn(state, ["lastAction"], action);
  }

  var currentImageIndex = state.images.findIndex(function (img) {
    return img.src === state.selectedImage;
  });
  if (currentImageIndex === -1) currentImageIndex = null;

  var getRegionIndex = function getRegionIndex(region) {
    var regionId = typeof region === "string" ? region : region.id;
    if (currentImageIndex === null) return null;
    var regionIndex = (state.images[currentImageIndex].regions || []).findIndex(function (r) {
      return r.id === regionId;
    });
    return regionIndex === -1 ? null : regionIndex;
  };

  var getRegion = function getRegion(regionId) {
    var regionIndex = getRegionIndex(regionId);
    if (regionIndex === null) return [null, null];
    var region = state.images[currentImageIndex].regions[regionIndex];
    return [region, regionIndex];
  };

  var modifyRegion = function modifyRegion(regionId, obj) {
    var _getRegion = getRegion(regionId),
        _getRegion2 = _slicedToArray(_getRegion, 2),
        region = _getRegion2[0],
        regionIndex = _getRegion2[1];

    if (!region) return state;

    if (obj !== null) {
      return setIn(state, ["images", currentImageIndex, "regions", regionIndex], _objectSpread({}, state.images[currentImageIndex].regions[regionIndex], obj));
    } else {
      // delete region
      var regions = state.images[currentImageIndex].regions;
      return setIn(state, ["images", currentImageIndex, "regions"], (regions || []).filter(function (r) {
        return r.id !== region.id;
      }));
    }
  };

  var unselectRegions = function unselectRegions(state) {
    if (currentImageIndex === null) return state;
    return setIn(state, ["images", currentImageIndex, "regions"], (state.images[currentImageIndex].regions || []).map(function (r) {
      return _objectSpread({}, r, {
        highlighted: false
      });
    }));
  };

  var saveToHistory = function saveToHistory(state, name) {
    return updateIn(state, ["history"], function (h) {
      return [{
        time: moment().toDate(),
        state: state,
        name: name
      }].concat((h || []).slice(0, 9));
    });
  };

  if (Object.keys(typesToSaveWithHistory).includes(action.type)) {
    state = saveToHistory(state, typesToSaveWithHistory[action.type] || action.type);
  }

  var closeEditors = function closeEditors(state) {
    if (currentImageIndex === null) return state;
    return setIn(state, ["images", currentImageIndex, "regions"], (state.images[currentImageIndex].regions || []).map(function (r) {
      return _objectSpread({}, r, {
        editingLabels: false
      });
    }));
  };

  var setNewImage = function setNewImage(newImage) {
    return setIn(state, ["selectedImage"], newImage);
  };

  switch (action.type) {
    case "@@INIT":
      {
        return state;
      }

    case "SELECT_IMAGE":
      {
        return setNewImage(action.image.src);
      }

    case "IMAGE_LOADED":
      {
        return setIn(state, ["images", currentImageIndex, "pixelSize"], {
          w: action.image.width,
          h: action.image.height
        });
      }

    case "CHANGE_REGION":
      {
        var regionIndex = getRegionIndex(action.region);
        if (regionIndex === null) return state;
        var oldRegion = state.images[currentImageIndex].regions[regionIndex];

        if (oldRegion.cls !== action.region.cls) {
          state = saveToHistory(state, "Change Region Classification");
        }

        if (!isEqual(oldRegion.tags, action.region.tags)) {
          state = saveToHistory(state, "Change Region Tags");
        }

        return setIn(state, ["images", currentImageIndex, "regions", regionIndex], action.region);
      }

    case "RESTORE_HISTORY":
      {
        if (state.history.length > 0) {
          return state.history[0].state;
        }

        return state;
      }

    case "CHANGE_IMAGE":
      {
        if (currentImageIndex === null) return state;
        var delta = action.delta;

        for (var _i = 0, _Object$keys = Object.keys(delta); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          if (key === "cls") saveToHistory(state, "Change Image Class");
          if (key === "tags") saveToHistory(state, "Change Image Tags");
          state = setIn(state, ["images", currentImageIndex, key], delta[key]);
        }

        return state;
      }

    case "SELECT_REGION":
      {
        var region = action.region;

        var _regionIndex = getRegionIndex(action.region);

        if (_regionIndex === null) return state;

        var regions = _toConsumableArray(state.images[currentImageIndex].regions || []).map(function (r) {
          return _objectSpread({}, r, {
            highlighted: r.id === region.id,
            editingLabels: r.id === region.id
          });
        });

        return setIn(state, ["images", currentImageIndex, "regions"], regions);
      }

    case "BEGIN_MOVE_POINT":
      {
        state = closeEditors(state);
        return setIn(state, ["mode"], {
          mode: "MOVE_REGION",
          regionId: action.point.id
        });
      }

    case "BEGIN_CIRCLE_TRANSFORM":
      {
        var circle = action.circle,
            directions = action.directions;
        state = closeEditors(state);

        if (directions === "MOVE_REGION") {
          return setIn(state, ["mode"], {
            mode: "MOVE_REGION",
            regionId: circle.id
          });
        } else {
          return setIn(state, ["mode"], {
            mode: "RESIZE_CIRCLE",
            regionId: circle.id,
            original: {
              x: circle.x,
              y: circle.y,
              xr: circle.xr,
              yr: circle.yr
            }
          });
        }
      }

    case "BEGIN_BOX_TRANSFORM":
      {
        var box = action.box,
            _directions = action.directions;
        state = closeEditors(state);

        if (_directions[0] === 0 && _directions[1] === 0) {
          return setIn(state, ["mode"], {
            mode: "MOVE_REGION",
            regionId: box.id
          });
        } else {
          return setIn(state, ["mode"], {
            mode: "RESIZE_BOX",
            regionId: box.id,
            freedom: _directions,
            original: {
              x: box.x,
              y: box.y,
              w: box.w,
              h: box.h
            }
          });
        }
      }

    case "BEGIN_MOVE_POLYGON_POINT":
      {
        var polygon = action.polygon,
            pointIndex = action.pointIndex;
        state = closeEditors(state);

        if (state.mode && state.mode.mode === "DRAW_POLYGON" && pointIndex === 0) {
          return setIn(modifyRegion(polygon, {
            points: polygon.points.slice(0, -1),
            open: false
          }), ["mode"], null);
        } else {
          state = saveToHistory(state, "Move Polygon Point");
        }

        return setIn(state, ["mode"], {
          mode: "MOVE_POLYGON_POINT",
          regionId: polygon.id,
          pointIndex: pointIndex
        });
      }

    case "ADD_POLYGON_POINT":
      {
        var _polygon = action.polygon,
            point = action.point,
            _pointIndex = action.pointIndex;

        var _regionIndex2 = getRegionIndex(_polygon);

        if (_regionIndex2 === null) return state;

        var points = _toConsumableArray(_polygon.points);

        points.splice(_pointIndex, 0, point);
        return setIn(state, ["images", currentImageIndex, "regions", _regionIndex2], _objectSpread({}, _polygon, {
          points: points
        }));
      }

    case "MOUSE_MOVE":
      {
        var x = action.x,
            y = action.y;
        if (!state.mode) return state;
        if (currentImageIndex === null) return state;

        switch (state.mode.mode) {
          case "MOVE_POLYGON_POINT":
            {
              var _state$mode = state.mode,
                  _pointIndex2 = _state$mode.pointIndex,
                  regionId = _state$mode.regionId;

              var _regionIndex3 = getRegionIndex(regionId);

              if (_regionIndex3 === null) return state;
              return setIn(state, ["images", currentImageIndex, "regions", _regionIndex3, "points", _pointIndex2], [x, y]);
            }

          case "MOVE_REGION":
            {
              var _regionId = state.mode.regionId;

              var _regionIndex4 = getRegionIndex(_regionId);

              if (_regionIndex4 === null) return state;
              return setIn(state, ["images", currentImageIndex, "regions", _regionIndex4], moveRegion(state.images[currentImageIndex].regions[_regionIndex4], x, y));
            }

          case "RESIZE_BOX":
            {
              var _state$mode2 = state.mode,
                  _regionId2 = _state$mode2.regionId,
                  _state$mode2$freedom = _slicedToArray(_state$mode2.freedom, 2),
                  xFree = _state$mode2$freedom[0],
                  yFree = _state$mode2$freedom[1],
                  _state$mode2$original = _state$mode2.original,
                  ox = _state$mode2$original.x,
                  oy = _state$mode2$original.y,
                  ow = _state$mode2$original.w,
                  oh = _state$mode2$original.h;

              var _regionIndex5 = getRegionIndex(_regionId2);

              if (_regionIndex5 === null) return state;
              var _box = state.images[currentImageIndex].regions[_regionIndex5];
              var dx = xFree === 0 ? ox : xFree === -1 ? Math.min(ox + ow, x) : ox;
              var dw = xFree === 0 ? ow : xFree === -1 ? ow + (ox - dx) : Math.max(0, ow + (x - ox - ow));
              var dy = yFree === 0 ? oy : yFree === -1 ? Math.min(oy + oh, y) : oy;
              var dh = yFree === 0 ? oh : yFree === -1 ? oh + (oy - dy) : Math.max(0, oh + (y - oy - oh)); // determine if we should switch the freedom

              if (dw <= 0.001) {
                state = setIn(state, ["mode", "freedom"], [xFree * -1, yFree]);
              }

              if (dh <= 0.001) {
                state = setIn(state, ["mode", "freedom"], [xFree, yFree * -1]);
              }

              return setIn(state, ["images", currentImageIndex, "regions", _regionIndex5], _objectSpread({}, _box, {
                x: dx,
                w: dw,
                y: dy,
                h: dh
              }));
            }

          case "RESIZE_CIRCLE":
            {
              var _regionId3 = state.mode.regionId;

              var _getRegion3 = getRegion(_regionId3),
                  _getRegion4 = _slicedToArray(_getRegion3, 2),
                  _region = _getRegion4[0],
                  _regionIndex6 = _getRegion4[1];

              if (!_region) return setIn(state, ["mode"], null);
              return setIn(state, ["images", currentImageIndex, "regions", _regionIndex6], _objectSpread({}, _region, {
                xr: action.x,
                yr: action.y
              }));
            }

          case "DRAW_POLYGON":
            {
              var _regionId4 = state.mode.regionId;

              var _getRegion5 = getRegion(_regionId4),
                  _getRegion6 = _slicedToArray(_getRegion5, 2),
                  _region2 = _getRegion6[0],
                  _regionIndex7 = _getRegion6[1];

              if (!_region2) return setIn(state, ["mode"], null);
              return setIn(state, ["images", currentImageIndex, "regions", _regionIndex7, "points", _region2.points.length - 1], [x, y]);
            }
        }

        return state;
      }

    case "MOUSE_DOWN":
      {
        var _x = action.x,
            _y = action.y;
        var newRegion;

        if (currentImageIndex !== null) {
          var _region3 = state.images[currentImageIndex].regions;

          if (state.allowedArea) {
            var aa = state.allowedArea;

            if (_x < aa.x || _x > aa.x + aa.w || _y < aa.y || _y > aa.y + aa.h) {
              return state;
            }
          }

          switch (state.selectedTool) {
            case "create-point":
              {
                state = saveToHistory(state, "Create Point");
                newRegion = {
                  type: "point",
                  x: _x,
                  y: _y,
                  highlighted: true,
                  editingLabels: true,
                  color: getRandomColor(),
                  id: getRandomId()
                };
                break;
              }

            case "create-box":
              {
                state = saveToHistory(state, "Create Box");
                newRegion = {
                  type: "box",
                  x: _x,
                  y: _x,
                  w: 0.01,
                  h: 0.01,
                  highlighted: true,
                  editingLabels: false,
                  color: getRandomColor(),
                  id: getRandomId()
                };
                state = unselectRegions(state);
                state = setIn(state, ["mode"], {
                  mode: "RESIZE_BOX",
                  editLabelEditorAfter: true,
                  regionId: newRegion.id,
                  freedom: [1, 1],
                  original: {
                    x: _x,
                    y: _y,
                    w: newRegion.w,
                    h: newRegion.h
                  }
                });
                break;
              }

            case "create-polygon":
              {
                if (state.mode && state.mode.mode === "DRAW_POLYGON") break;
                state = saveToHistory(state, "Create Polygon");
                newRegion = {
                  type: "polygon",
                  points: [[_x, _y], [_x, _y]],
                  open: true,
                  highlighted: true,
                  color: getRandomColor(),
                  id: getRandomId()
                };
                state = setIn(state, ["mode"], {
                  mode: "DRAW_POLYGON",
                  regionId: newRegion.id
                });
                break;
              }

            case "create-circle":
              {
                state = saveToHistory(state, "Create Circle");
                newRegion = {
                  type: "circle",
                  x: _x,
                  y: _y,
                  xr: 0.00000000001,
                  yr: 0.00000000001,
                  highlighted: true,
                  editingLabels: false,
                  color: getRandomColor(),
                  id: getRandomId()
                };
                state = unselectRegions(state);
                state = setIn(state, ["mode"], {
                  mode: "RESIZE_CIRCLE",
                  editLabelEditorAfter: true,
                  regionId: newRegion.id,
                  original: {
                    x: _x,
                    y: _y,
                    xr: newRegion.xr,
                    yr: newRegion.yr
                  }
                });
                break;
              }
          }
        }

        if (newRegion) {
          state = unselectRegions(state);
        }

        if (state.mode) {
          switch (state.mode.mode) {
            case "DRAW_POLYGON":
              {
                var _getRegion7 = getRegion(state.mode.regionId),
                    _getRegion8 = _slicedToArray(_getRegion7, 2),
                    _polygon2 = _getRegion8[0],
                    _regionIndex8 = _getRegion8[1];

                if (!_polygon2) break;
                state = setIn(state, ["images", currentImageIndex, "regions", _regionIndex8], _objectSpread({}, _polygon2, {
                  points: _polygon2.points.concat([[_x, _y]])
                }));
              }
          }
        }

        var _regions = _toConsumableArray(state.images[currentImageIndex].regions || []).map(function (r) {
          return _objectSpread({}, r, {
            editingLabels: false
          });
        }).concat(newRegion ? [newRegion] : []);

        return setIn(state, ["images", currentImageIndex, "regions"], _regions);
      }

    case "MOUSE_UP":
      {
        var _x2 = action.x,
            _y2 = action.y;
        if (!state.mode) return state;

        switch (state.mode.mode) {
          case "RESIZE_BOX":
            {
              if (state.mode.editLabelEditorAfter) {
                return _objectSpread({}, modifyRegion(state.mode.regionId, {
                  editingLabels: true
                }), {
                  mode: null
                });
              }
            }

          case "RESIZE_CIRCLE":
            {
              if (state.mode.editLabelEditorAfter) {
                return _objectSpread({}, modifyRegion(state.mode.regionId, {
                  editingLabels: true
                }), {
                  mode: null
                });
              }
            }

          case "MOVE_REGION":
          case "MOVE_POLYGON_POINT":
            {
              return _objectSpread({}, state, {
                mode: null
              });
            }
        }

        return state;
      }

    case "CHANGE_REGION":
      {
        var _region4 = action.region;

        var _regionIndex9 = getRegionIndex(action.region);

        if (_regionIndex9 === null) return state;
        return setIn(state, ["images", currentImageIndex, "regions", _regionIndex9], _region4);
      }

    case "OPEN_REGION_EDITOR":
      {
        var _region5 = action.region;

        var _regionIndex10 = getRegionIndex(action.region);

        if (_regionIndex10 === null) return state;
        var newRegions = setIn(state.images[currentImageIndex].regions.map(function (r) {
          return _objectSpread({}, r, {
            highlighted: false,
            editingLabels: false
          });
        }), [_regionIndex10], _objectSpread({}, (state.images[currentImageIndex].regions || [])[_regionIndex10], {
          highlighted: true,
          editingLabels: true
        }));
        return setIn(state, ["images", currentImageIndex, "regions"], newRegions);
      }

    case "CLOSE_REGION_EDITOR":
      {
        var _region6 = action.region;

        var _regionIndex11 = getRegionIndex(action.region);

        if (_regionIndex11 === null) return state;
        return setIn(state, ["images", currentImageIndex, "regions", _regionIndex11], _objectSpread({}, (state.images[currentImageIndex].regions || [])[_regionIndex11], {
          editingLabels: false
        }));
      }

    case "DELETE_REGION":
      {
        var _regionIndex12 = getRegionIndex(action.region);

        if (_regionIndex12 === null) return state;
        return setIn(state, ["images", currentImageIndex, "regions"], (state.images[currentImageIndex].regions || []).filter(function (r) {
          return r.id !== action.region.id;
        }));
      }

    case "ZOOM_HISTORY":
      {
        var _region7 = action.region,
            direction = action.direction;

        if (direction == "ADD_NEW") {
          return updateIn(state, ["zoomHistory"], function (zh) {
            return [_region7].concat((zh || []).slice());
          });
        } else {
          return updateIn(state, ["zoomHistory"], function (zh) {
            var newRegion = (zh || []).slice();
            newRegion = newRegion.asMutable({
              deep: true
            });
            newRegion.splice(_region7, 1);
            return newRegion;
          });
        }
      }

    case "RESET_ZOOM_HISTORY":
      {
        return setIn(state, ["zoomHistory"], []);
      }

    case "HEADER_BUTTON_CLICKED":
      {
        var buttonName = action.buttonName.toLowerCase();

        switch (buttonName) {
          case "prev":
            {
              if (currentImageIndex === null) return state;
              if (currentImageIndex === 0) return state;
              return setNewImage(state.images[currentImageIndex - 1].src);
            }

          case "next":
            {
              if (currentImageIndex === null) return state;
              if (currentImageIndex === state.images.length - 1) return state;
              return setNewImage(state.images[currentImageIndex + 1].src);
            }

          case "settings":
            {
              return setIn(state, ["settingsOpen"], !state.settingsOpen);
            }

          case "help":
            {
              return state;
            }

          case "fullscreen":
            {
              return setIn(state, ["fullScreen"], true);
            }

          case "exit fullscreen":
          case "window":
            {
              return setIn(state, ["fullScreen"], false);
            }

          case "hotkeys":
            {
              return state;
            }

          case "exit":
          case "done":
            {
              return state;
            }
        }

        return state; // return setIn(state, [""]
      }

    case "SELECT_TOOL":
      {
        state = setIn(state, ["mode"], null);

        if (action.selectedTool === "show-tags") {
          return setIn(state, ["showTags"], !state.showTags);
        }

        return setIn(state, ["selectedTool"], action.selectedTool);
      }

    case "CHANGE_CURRENT_MAT":
      {
        return setIn(state, ["currentMat"], action.currentMat);
      }

    case "CANCEL":
      {
        var _state = state,
            mode = _state.mode;

        if (mode) {
          switch (mode.mode) {
            case "DRAW_POLYGON":
              {
                var _regionId5 = mode.regionId;
                return modifyRegion(_regionId5, null);
              }

            case "MOVE_POLYGON_POINT":
            case "RESIZE_BOX":
            case "RESIZE_CIRCLE":
            case "MOVE_REGION":
              {
                return setIn(state, ["mode"], null);
              }
          }
        } // Close any open boxes


        var _regions2 = state.images[currentImageIndex].regions;

        if (_regions2.some(function (r) {
          return r.editingLabels;
        })) {
          return setIn(state, ["images", currentImageIndex, "regions"], _regions2.map(function (r) {
            return _objectSpread({}, r, {
              editingLabels: false
            });
          }));
        } else {
          return setIn(state, ["images", currentImageIndex, "regions"], _regions2.map(function (r) {
            return _objectSpread({}, r, {
              highlighted: false
            });
          }));
        }
      }
  }

  return state;
});
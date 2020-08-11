import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import React, { useEffect, useState } from 'react';
import ImageCanvas from '../ImageCanvas';
import useKey from 'use-key-hook';
import { useSettings } from '../SettingsProvider';
import { Matrix } from 'transformation-matrix-js';
export default (function (_ref) {
  var state = _ref.state,
      dispatch = _ref.dispatch,
      regions = _ref.regions;
  var settings = useSettings();

  var action = function action(type) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return params.length > 0 ? dispatch(_objectSpread({
        type: type
      }, params.reduce(function (acc, p, i) {
        return acc[p] = args[i], acc;
      }, {}))) : dispatch(_objectSpread({
        type: type
      }, args[0]));
    };
  };

  var currentImage = state.images.find(function (img) {
    return img.src === state.selectedImage;
  });
  useKey(function () {
    return dispatch({
      type: 'CANCEL'
    });
  }, {
    detectKeys: [27]
  });

  if (state.changeMat === undefined) {
    state.changeMat = function (mat) {
      dispatch({
        type: 'CHANGE_CURRENT_MAT',
        currentMat: mat
      });
    };
  }

  useEffect(function () {
    state.onImagesChange(state.images);
  }, [JSON.stringify(state.images)]);
  var currentRegions = currentImage && currentImage.regions ? currentImage.regions : [];
  return React.createElement("div", {
    style: {
      width: '760px',
      height: '700px'
    },
    className: "m-3 px-2"
  }, React.createElement(ImageCanvas, Object.assign({}, settings, {
    key: state.selectedImage,
    showTags: state.showTags,
    allowedArea: state.allowedArea,
    regionClsList: state.regionClsList,
    regionTagList: state.regionTagList,
    regions: [].concat(_toConsumableArray(currentRegions), _toConsumableArray(regions)),
    realSize: currentImage ? currentImage.realSize : undefined,
    imageSrc: state.selectedImage,
    pointDistancePrecision: state.pointDistancePrecision,
    createWithPrimary: state.selectedTool.includes('create'),
    dragWithPrimary: state.selectedTool === 'pan',
    zoomWithPrimary: state.selectedTool === 'zoom',
    zoomOutWithPrimary: state.selectedTool === 'zoom-out',
    showPointDistances: state.showPointDistances,
    zoomHistory: state.zoomHistory,
    changeZoomHistory: action('ZOOM_HISTORY', 'region', 'direction'),
    resetZoomHistory: action('RESET_ZOOM_HISTORY'),
    onMouseMove: action('MOUSE_MOVE'),
    onMouseDown: action('MOUSE_DOWN'),
    onMouseUp: action('MOUSE_UP'),
    onChangeRegion: action('CHANGE_REGION', 'region'),
    onBeginRegionEdit: action('OPEN_REGION_EDITOR', 'region'),
    onCloseRegionEdit: action('CLOSE_REGION_EDITOR', 'region'),
    onDeleteRegion: action('DELETE_REGION', 'region'),
    onBeginCircleTransform: action('BEGIN_CIRCLE_TRANSFORM', 'circle', 'directions'),
    onBeginBoxTransform: action('BEGIN_BOX_TRANSFORM', 'box', 'directions'),
    onBeginMovePolygonPoint: action('BEGIN_MOVE_POLYGON_POINT', 'polygon', 'pointIndex'),
    onAddPolygonPoint: action('ADD_POLYGON_POINT', 'polygon', 'point', 'pointIndex'),
    onSelectRegion: action('SELECT_REGION', 'region'),
    onBeginMovePoint: action('BEGIN_MOVE_POINT', 'point'),
    onImageLoaded: action('IMAGE_LOADED', 'image'),
    mat: Matrix.from(state.currentMat),
    changeMat: state.changeMat,
    onIhIwChange: state.onIhIwChange,
    setImageLoaded: state.setImageLoaded,
    handleScaleChange: state.handleScaleChange,
    getRegionCoordinates: state.handleRegionChange
  })));
});
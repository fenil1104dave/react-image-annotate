import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useReducer, useEffect } from "react";
import MainLayout from "../MainLayout";
import SettingsProvider from "../SettingsProvider";
import reducer from "./reducer";
import { Matrix } from "transformation-matrix-js";

var getDefaultMat = function getDefaultMat() {
  return Matrix.from(1, 0, 0, 1, -10, -10);
};

export default (function (_ref) {
  var images = _ref.images,
      _ref$onImagesChange = _ref.onImagesChange,
      onImagesChange = _ref$onImagesChange === void 0 ? function () {} : _ref$onImagesChange,
      allowedArea = _ref.allowedArea,
      _ref$selectedImage = _ref.selectedImage,
      selectedImage = _ref$selectedImage === void 0 ? images.length > 0 ? images[0].src : undefined : _ref$selectedImage,
      showPointDistances = _ref.showPointDistances,
      pointDistancePrecision = _ref.pointDistancePrecision,
      _ref$selectedTool = _ref.selectedTool,
      selectedTool = _ref$selectedTool === void 0 ? "select" : _ref$selectedTool,
      _ref$showTags = _ref.showTags,
      showTags = _ref$showTags === void 0 ? true : _ref$showTags,
      _ref$enabledTools = _ref.enabledTools,
      enabledTools = _ref$enabledTools === void 0 ? ["select", "create-point", "create-box", "create-polygon", "create-circle"] : _ref$enabledTools,
      _ref$regionTagList = _ref.regionTagList,
      regionTagList = _ref$regionTagList === void 0 ? [] : _ref$regionTagList,
      _ref$regionClsList = _ref.regionClsList,
      regionClsList = _ref$regionClsList === void 0 ? [] : _ref$regionClsList,
      _ref$imageTagList = _ref.imageTagList,
      imageTagList = _ref$imageTagList === void 0 ? [] : _ref$imageTagList,
      _ref$imageClsList = _ref.imageClsList,
      imageClsList = _ref$imageClsList === void 0 ? [] : _ref$imageClsList,
      taskDescription = _ref.taskDescription,
      _ref$currentMat = _ref.currentMat,
      currentMat = _ref$currentMat === void 0 ? getDefaultMat() : _ref$currentMat,
      changeMat = _ref.changeMat,
      _ref$onIhIwChange = _ref.onIhIwChange,
      onIhIwChange = _ref$onIhIwChange === void 0 ? function () {} : _ref$onIhIwChange,
      onExit = _ref.onExit,
      _ref$setImageLoaded = _ref.setImageLoaded,
      setImageLoaded = _ref$setImageLoaded === void 0 ? function () {} : _ref$setImageLoaded,
      _ref$handleScaleChang = _ref.handleScaleChange,
      handleScaleChange = _ref$handleScaleChang === void 0 ? function () {} : _ref$handleScaleChang;

  var _useReducer = useReducer(reducer, {
    showTags: showTags,
    allowedArea: allowedArea,
    selectedImage: selectedImage,
    showPointDistances: showPointDistances,
    pointDistancePrecision: pointDistancePrecision,
    selectedTool: selectedTool,
    // selectedTool: "select",
    mode: null,
    taskDescription: taskDescription,
    images: images,
    onImagesChange: onImagesChange,
    labelImages: imageClsList.length > 0 || imageTagList.length > 0,
    regionClsList: regionClsList,
    regionTagList: regionTagList,
    imageClsList: imageClsList,
    imageTagList: imageTagList,
    currentMat: currentMat,
    changeMat: changeMat,
    onIhIwChange: onIhIwChange,
    enabledTools: enabledTools,
    history: [],
    setImageLoaded: setImageLoaded,
    handleScaleChange: handleScaleChange
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatchToReducer = _useReducer2[1];

  useEffect(function () {
    dispatchToReducer({
      type: "SELECT_TOOL",
      selectedTool: selectedTool
    });
  }, [selectedTool]);
  useEffect(function () {
    if (showTags !== state.showTags) {
      dispatchToReducer({
        type: "SELECT_TOOL",
        selectedTool: "show-tags"
      });
    }
  }, [showTags]);
  useEffect(function () {
    dispatchToReducer({
      type: "CHANGE_IMAGES",
      images: images
    });
  }, [JSON.stringify(images)]);
  useEffect(function () {
    dispatchToReducer({
      type: "SELECT_IMAGE",
      image: {
        src: selectedImage
      }
    });
  }, [selectedImage]);
  useEffect(function () {
    dispatchToReducer({
      type: "CHANGE_CURRENT_MAT",
      currentMat: currentMat
    });
  }, [JSON.stringify(currentMat)]);

  var dispatch = function dispatch(action) {
    if (action.type === "HEADER_BUTTON_CLICKED" && (action.buttonName === "Exit" || action.buttonName === "Done" || action.buttonName === "Save" || action.buttonName === "Complete")) {
      onExit(_objectSpread({}, state, {
        history: undefined
      }));
    } else {
      dispatchToReducer(action);
    }
  };

  return /*#__PURE__*/React.createElement(SettingsProvider, null, /*#__PURE__*/React.createElement(MainLayout, {
    debug: true,
    state: state,
    dispatch: dispatch
  }));
});
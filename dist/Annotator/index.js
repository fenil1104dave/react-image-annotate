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
      onExit = _ref.onExit;

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
    history: []
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
    console.log("Annotator inside useeffect");
    console.log(images);
    dispatchToReducer({
      type: "CHANGE_IMAGES",
      images: images
    });
  }, [JSON.stringify(images)]);
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

  return React.createElement(SettingsProvider, null, React.createElement(MainLayout, {
    debug: true,
    state: state,
    dispatch: dispatch
  }));
}); // import logging
// from _socket import gaierror
//
// import botocore.exceptions as botocore_exceptions
// from django.core.exceptions import ValidationError as DjangoValidationError
//
// from paramiko.ssh_exception import NoValidConnectionsError, AuthenticationException, SSHException
// from rest_framework import status
// from rest_framework.decorators import api_view, permission_classes
// from rest_framework.exceptions import ValidationError
// from rest_framework.permissions import AllowAny
// from rest_framework.response import Response
// from scp import SCPException
//
// from classif_ai.helpers import authenticate_user
// from classif_ai.models import Defect
// from classif_ai.services import MlModelService
// from classif_ai.services.ml_model.ml_model_migrator_service import MlModelMigratorService
// from classif_ai.view_serializers.ml_model_views_serializers import MigrateSerializer
// data = {
// 	"name": "MetalDepandDarc_v3 (Unknown_Bin)",
// 	"model_server_id": "i-063e9c39de856a61a",
// 	"model_path": "/data/himanshu/GF/GF_all_data/modelv4/Metal_Derp_Darc_data_movement_20200405/models_freeze_70/best_model/Metal_freeze_70_epoch_28_data_update_unknown_prod.pt",
// 	"organization_code": "gf",
// 	"model_type": "torch",
// 	"change_model_output_from_defect_code_to_id": True,
// 	"status": "active"
// }
// request_validator = MigrateSerializer(data=data)
// request_validator.is_valid(raise_exception=True)
// service = MlModelMigratorService()
// service.migrate(**request_validator.data)
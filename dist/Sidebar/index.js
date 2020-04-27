import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TaskDescription from "../TaskDescriptionSidebarBox";
import ImageSelector from "../ImageSelectorSidebarBox";
import RegionSelector from "../RegionSelectorSidebarBox";
import History from "../HistorySidebarBox";
import DebugBox from "../DebugSidebarBox";
import TagsSidebarBox from "../TagsSidebarBox";
var useStyles = makeStyles({});
export default (function (_ref) {
  var debug = _ref.debug,
      taskDescription = _ref.taskDescription,
      images = _ref.images,
      regions = _ref.regions,
      history = _ref.history,
      labelImages = _ref.labelImages,
      currentImage = _ref.currentImage,
      imageClsList = _ref.imageClsList,
      imageTagList = _ref.imageTagList,
      onChangeImage = _ref.onChangeImage,
      onSelectRegion = _ref.onSelectRegion,
      onSelectImage = _ref.onSelectImage,
      onChangeRegion = _ref.onChangeRegion,
      onDeleteRegion = _ref.onDeleteRegion,
      _onRestoreHistory = _ref.onRestoreHistory;
  var classes = useStyles();
  return /*#__PURE__*/React.createElement("div", null, debug && /*#__PURE__*/React.createElement(DebugBox, {
    state: debug,
    lastAction: debug.lastAction
  }), /*#__PURE__*/React.createElement(TaskDescription, {
    description: taskDescription
  }), labelImages && /*#__PURE__*/React.createElement(TagsSidebarBox, {
    currentImage: currentImage,
    imageClsList: imageClsList,
    imageTagList: imageTagList,
    onChangeImage: onChangeImage,
    expandedByDefault: true
  }), /*#__PURE__*/React.createElement(ImageSelector, {
    onSelect: onSelectImage,
    images: images
  }), /*#__PURE__*/React.createElement(RegionSelector, {
    regions: regions,
    onSelectRegion: onSelectRegion,
    onChangeRegion: onChangeRegion,
    onDeleteRegion: onDeleteRegion
  }), /*#__PURE__*/React.createElement(History, {
    history: history,
    onRestoreHistory: function onRestoreHistory() {
      return _onRestoreHistory();
    }
  }));
});
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { Fragment, useState } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import RegionIcon from "@material-ui/icons/PictureInPicture";
import Grid from "@material-ui/core/Grid";
import ReorderIcon from "@material-ui/icons/SwapVert";
import PieChartIcon from "@material-ui/icons/PieChart";
import TrashIcon from "@material-ui/icons/Delete";
import LockIcon from "@material-ui/icons/Lock";
import UnlockIcon from "@material-ui/icons/LockOpen";
import VisibleIcon from "@material-ui/icons/Visibility";
import VisibleOffIcon from "@material-ui/icons/VisibilityOff";
import styles from "./styles";
import classnames from "classnames";
var useStyles = makeStyles(styles);

var Chip = function Chip(_ref) {
  var color = _ref.color,
      text = _ref.text;
  var classes = useStyles();
  return /*#__PURE__*/React.createElement("span", {
    className: classes.chip
  }, /*#__PURE__*/React.createElement("div", {
    className: "color",
    style: {
      backgroundColor: color
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text"
  }, text));
};

var Row = function Row(_ref2) {
  var header = _ref2.header,
      highlighted = _ref2.highlighted,
      order = _ref2.order,
      classification = _ref2.classification,
      area = _ref2.area,
      tags = _ref2.tags,
      trash = _ref2.trash,
      lock = _ref2.lock,
      visible = _ref2.visible,
      onClick = _ref2.onClick;
  var classes = useStyles();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      mouseOver = _useState2[0],
      changeMouseOver = _useState2[1];

  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: function onMouseEnter() {
      return changeMouseOver(true);
    },
    onMouseLeave: function onMouseLeave() {
      return changeMouseOver(false);
    },
    className: classnames(classes.row, {
      header: header,
      highlighted: highlighted
    })
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 2
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      paddingRight: 10
    }
  }, order)), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 5
  }, classification), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 2
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      paddingRight: 6
    }
  }, area)), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1
  }, trash), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1
  }, lock), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1
  }, visible)));
};

export default (function (_ref3) {
  var regions = _ref3.regions,
      onDeleteRegion = _ref3.onDeleteRegion,
      onChangeRegion = _ref3.onChangeRegion,
      onSelectRegion = _ref3.onSelectRegion;
  var classes = useStyles();
  return /*#__PURE__*/React.createElement(SidebarBoxContainer, {
    title: "Regions",
    subTitle: "",
    icon: /*#__PURE__*/React.createElement(RegionIcon, {
      style: {
        color: grey[700]
      }
    }),
    expandedByDefault: true
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.container
  }, /*#__PURE__*/React.createElement(Row, {
    header: true,
    highlighted: false,
    order: /*#__PURE__*/React.createElement(ReorderIcon, {
      className: "icon"
    }),
    classification: /*#__PURE__*/React.createElement("div", {
      style: {
        paddingLeft: 10
      }
    }, "Class"),
    area: /*#__PURE__*/React.createElement(PieChartIcon, {
      className: "icon"
    }),
    trash: /*#__PURE__*/React.createElement(TrashIcon, {
      className: "icon"
    }),
    lock: /*#__PURE__*/React.createElement(LockIcon, {
      className: "icon"
    }),
    visible: /*#__PURE__*/React.createElement(VisibleIcon, {
      className: "icon"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid ".concat(grey[200]),
      marginTop: 2,
      marginBottom: 2
    }
  }), regions.map(function (r, i) {
    return /*#__PURE__*/React.createElement(Row, {
      header: false,
      highlighted: r.highlighted,
      onClick: function onClick() {
        return onSelectRegion(r);
      },
      key: r.id,
      order: "#".concat(i + 1),
      classification: /*#__PURE__*/React.createElement(Chip, {
        text: r.cls || "",
        color: r.color || "#ddd"
      }),
      area: "",
      trash: /*#__PURE__*/React.createElement(TrashIcon, {
        onClick: function onClick() {
          return onDeleteRegion(r);
        },
        className: "icon2"
      }),
      lock: r.locked ? /*#__PURE__*/React.createElement(LockIcon, {
        onClick: function onClick() {
          return onChangeRegion(_objectSpread({}, r, {
            locked: false
          }));
        },
        className: "icon2"
      }) : /*#__PURE__*/React.createElement(UnlockIcon, {
        onClick: function onClick() {
          return onChangeRegion(_objectSpread({}, r, {
            locked: true
          }));
        },
        className: "icon2"
      }),
      visible: r.visible || r.visible === undefined ? /*#__PURE__*/React.createElement(VisibleIcon, {
        onClick: function onClick() {
          return onChangeRegion(_objectSpread({}, r, {
            visible: false
          }));
        },
        className: "icon2"
      }) : /*#__PURE__*/React.createElement(VisibleOffIcon, {
        onClick: function onClick() {
          return onChangeRegion(_objectSpread({}, r, {
            visible: true
          }));
        },
        className: "icon2"
      })
    });
  })));
});
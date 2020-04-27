import React, { createContext } from "react";
import Button from "@material-ui/core/Button";
export var HeaderButtonContext = createContext();
export default (function (_ref) {
  var name = _ref.name,
      Icon = _ref.Icon;
  return /*#__PURE__*/React.createElement(HeaderButtonContext.Consumer, null, function (_ref2) {
    var onHeaderButtonClick = _ref2.onHeaderButtonClick;
    return /*#__PURE__*/React.createElement(Button, {
      onClick: function onClick() {
        return onHeaderButtonClick(name);
      },
      style: {
        width: 80,
        margin: 2
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Icon, {
      style: {}
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: "bold"
      }
    }, name)));
  });
});
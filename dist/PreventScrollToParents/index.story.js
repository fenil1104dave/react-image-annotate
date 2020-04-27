import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import RemoveScrollOnChildren from "./";
storiesOf("RemoveScrollOnChildren", module).add("Basic", function () {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100vh",
      textAlign: "center",
      height: "200vh"
    }
  }, /*#__PURE__*/React.createElement(RemoveScrollOnChildren, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      width: 100,
      height: 100,
      backgroundColor: "red"
    }
  })));
});
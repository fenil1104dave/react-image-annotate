import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

var ErrorBoundaryDialog = /*#__PURE__*/function (_Component) {
  _inherits(ErrorBoundaryDialog, _Component);

  var _super = _createSuper(ErrorBoundaryDialog);

  function ErrorBoundaryDialog() {
    var _this;

    _classCallCheck(this, ErrorBoundaryDialog);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      hasError: false,
      err: ''
    };
    return _this;
  }

  _createClass(ErrorBoundaryDialog, [{
    key: "componentDidCatch",
    value: function componentDidCatch(err, info) {
      this.setState({
        hasError: true,
        err: err.toString() + '\n\n' + info.componentStack
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return React.createElement(Dialog, {
          open: this.state.hasError,
          onClose: this.props.onClose
        }, React.createElement(DialogTitle, null, "Error Loading Annotator"), React.createElement(DialogContent, null, React.createElement("pre", null, this.state.err)), React.createElement(DialogActions, null, React.createElement(Button, {
          onClick: this.props.onClose
        }, "Close")));
      }

      return this.props.children;
    }
  }]);

  return ErrorBoundaryDialog;
}(Component);

export { ErrorBoundaryDialog as default };
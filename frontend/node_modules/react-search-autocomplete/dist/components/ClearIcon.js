"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClearIcon = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _jsxRuntime = require("react/jsx-runtime");

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ClearIcon = function ClearIcon(_ref) {
  var showClear = _ref.showClear,
      setSearchString = _ref.setSearchString,
      searchString = _ref.searchString,
      setFocus = _ref.setFocus,
      onClear = _ref.onClear;

  var handleClearSearchString = function handleClearSearchString() {
    setSearchString({
      target: {
        value: ''
      }
    });
    setFocus();
    onClear();
  };

  if (!showClear) {
    return null;
  }

  if (searchString.length <= 0) {
    return null;
  }

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StyledClearIcon, {
    className: "clear-icon",
    onClick: handleClearSearchString,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
      width: 20,
      height: 20,
      focusable: "false",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
        d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.58 12 5 17.58 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      })
    })
  });
};

exports.ClearIcon = ClearIcon;

var StyledClearIcon = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  margin: ", ";\n\n  &:hover {\n    cursor: pointer;\n  }\n\n  > svg {\n    fill: ", ";\n  }\n"])), function (props) {
  return props.theme.clearIconMargin;
}, function (props) {
  return props.theme.iconColor;
});
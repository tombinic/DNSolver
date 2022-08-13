"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchIcon = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _jsxRuntime = require("react/jsx-runtime");

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var SearchIcon = function SearchIcon(_ref) {
  var showIcon = _ref.showIcon;

  if (!showIcon) {
    return null;
  }

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StyledSearchIcon, {
    className: "search-icon",
    width: 20,
    height: 20,
    focusable: "false",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    })
  });
};

exports.SearchIcon = SearchIcon;

var StyledSearchIcon = _styledComponents.default.svg(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  flex-shrink: 0;\n  margin: ", ";\n  fill: ", ";\n"])), function (props) {
  return props.theme.searchIconMargin;
}, function (props) {
  return props.theme.iconColor;
});
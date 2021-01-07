/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
eval("// for (let i of [0, 1, 2]) {\n//     console.info(i)\n// }\nfunction createElement(type, attributes) {\n  var element = document.createElement(type); // let element\n  // if (typeof type === 'string')\n  //     element = document.createElement(type)\n  // else\n  //     element = new type\n\n  for (var attrName in attributes) {\n    element.setAttribute(attrName, attributes[attrName]);\n  }\n\n  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    children[_key - 2] = arguments[_key];\n  }\n\n  for (var _i = 0, _children = children; _i < _children.length; _i++) {\n    child = _children[_i];\n\n    if (typeof child === 'string') {\n      child = document.createTextNode(child);\n    }\n\n    element.appendChild(child);\n  }\n\n  return element;\n}\n\nvar a = createElement(\"div\", {\n  id: \"123\"\n}, createElement(\"span\", null, \"1\"), createElement(\"span\", null, \"2\"), createElement(\"span\", null, \"3\"), \"565675675\");\ndocument.body.appendChild(a); // console.info(a)\n// var a = createElement(\"div\", {\n//     id: \"123\"\n//   },\n//   createElement(\"span\", null),\n//   createElement(\"span\", null),\n//   createElement(\"span\", null)\n// );\n\n//# sourceURL=webpack://jsx/./main.js?");
/******/ })()
;
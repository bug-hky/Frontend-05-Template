/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./Animation.js":
/*!**********************!*\
  !*** ./Animation.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Timeline\": () => /* binding */ Timeline,\n/* harmony export */   \"Animation\": () => /* binding */ Animation\n/* harmony export */ });\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n// setTimeout\n// setInterval\n// tick\nvar TICK = Symbol('tick');\nvar TICK_HANDLER = Symbol('tick-handler');\nvar ANIMATIONS = Symbol('animations');\nvar START_TIME = Symbol('start-time');\nvar PAUSE_START = Symbol('pause-start');\nvar PAUSE_TIME = Symbol('pause-time');\nvar Timeline = /*#__PURE__*/function () {\n  function Timeline() {\n    _classCallCheck(this, Timeline);\n\n    // 添加animation队列\n    this.state = 'Inited';\n    this[ANIMATIONS] = new Set();\n    this[START_TIME] = new Map();\n  } // 开始\n\n\n  _createClass(Timeline, [{\n    key: \"start\",\n    value: function start() {\n      var _this = this;\n\n      if (this.state !== 'Inited') return false;\n      this.state = 'Started';\n      var startTime = Date.now(); // 初始化的暂停时间为0\n\n      this[PAUSE_TIME] = 0;\n\n      this[TICK] = function () {\n        // let t = Date.now() - startTime\n        var now = Date.now();\n\n        var _iterator = _createForOfIteratorHelper(_this[ANIMATIONS]),\n            _step;\n\n        try {\n          for (_iterator.s(); !(_step = _iterator.n()).done;) {\n            var animation = _step.value;\n            var t = void 0;\n            if (_this[START_TIME].get(animation) < startTime) t = now - startTime - _this[PAUSE_TIME] - animation.delay;else t = now - _this[START_TIME].get(animation) - _this[PAUSE_TIME] - animation.delay;\n\n            if (animation.duration < t) {\n              _this[ANIMATIONS][\"delete\"](animation);\n\n              t = animation.duration;\n            } // 当t < 0的时候说明延时dealy还没有结束，动画还没有开始\n\n\n            if (t > 0) animation.receiveTime(t);\n          }\n        } catch (err) {\n          _iterator.e(err);\n        } finally {\n          _iterator.f();\n        }\n\n        _this[TICK_HANDLER] = requestAnimationFrame(_this[TICK]);\n      };\n\n      this[TICK]();\n    } // 播放速率\n    // 暂停\n\n  }, {\n    key: \"pause\",\n    value: function pause() {\n      if (this.state !== 'Started') return false;\n      this.state = 'Paused';\n      this[PAUSE_START] = Date.now();\n      cancelAnimationFrame(this[TICK_HANDLER]);\n    } // 恢复\n\n  }, {\n    key: \"resume\",\n    value: function resume() {\n      if (this.state !== 'Paused') return false;\n      this.state = 'Started';\n      this[PAUSE_TIME] += Date.now() - this[PAUSE_START];\n      this[TICK]();\n    } // 重置\n\n  }, {\n    key: \"reset\",\n    value: function reset() {\n      this.pause();\n      this.state = 'Inited';\n      this[ANIMATIONS] = new Set();\n      this[START_TIME] = new Map();\n      this[TICK_HANDLER] = null;\n      this[PAUSE_START] = 0;\n      this[PAUSE_TIME] = 0;\n    } // 添加动画\n\n  }, {\n    key: \"add\",\n    value: function add(animation, startTime) {\n      if (arguments.length < 2) {\n        startTime = Date.now();\n      }\n\n      this[ANIMATIONS].add(animation);\n      this[START_TIME].set(animation, startTime);\n    }\n  }]);\n\n  return Timeline;\n}(); // 属性动画：把一个对象的某个属性从一个值变成另外一个值\n// 帧动画：每一秒来一张图片\n\nvar Animation = /*#__PURE__*/function () {\n  /**\r\n   * object, property, startValue, endValue, duration这五个属性是必选参数\r\n   * timingFunction差值函数\r\n   * */\n  function Animation(object, property, startValue, endValue, duration, delay, timingFunction, template) {\n    _classCallCheck(this, Animation);\n\n    // 加上timingFunction和template的默认值处理\n    timingFunction = timingFunction || function (v) {\n      return v;\n    };\n\n    template = template || function (v) {\n      return v;\n    };\n\n    this.object = object;\n    this.property = property;\n    this.startValue = startValue;\n    this.endValue = endValue;\n    this.duration = duration;\n    this.timingFunction = timingFunction;\n    this.delay = delay;\n    this.template = template;\n  }\n\n  _createClass(Animation, [{\n    key: \"receiveTime\",\n    value: function receiveTime(time) {\n      console.info('time =>', this.object[this.property]);\n      var range = this.endValue - this.startValue; // 使用timingFunction处理动画的进度\n\n      var progress = this.timingFunction(time / this.duration);\n      this.object[this.property] = this.template(this.startValue + range * progress);\n    }\n  }]);\n\n  return Animation;\n}();\n\n//# sourceURL=webpack://carousel/./Animation.js?");

/***/ }),

/***/ "./Carousel.js":
/*!*********************!*\
  !*** ./Carousel.js ***!
  \*********************/
/***/ (() => {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\Carousel.js: Identifier 'STATE' has already been declared (6:9)\\n\\n\\u001b[0m \\u001b[90m 4 | \\u001b[39m\\u001b[36mimport\\u001b[39m { ease } from \\u001b[32m'./Ease'\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 5 | \\u001b[39m\\u001b[0m\\n\\u001b[0m\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 6 | \\u001b[39m\\u001b[36mimport\\u001b[39m { \\u001b[33mSTATE\\u001b[39m } from \\u001b[32m'./Framework'\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m   | \\u001b[39m         \\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 7 | \\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 8 | \\u001b[39m\\u001b[36mexport\\u001b[39m \\u001b[36mclass\\u001b[39m \\u001b[33mCarousel\\u001b[39m \\u001b[36mextends\\u001b[39m \\u001b[33mComponent\\u001b[39m {\\u001b[0m\\n\\u001b[0m \\u001b[90m 9 | \\u001b[39m    constructor () {\\u001b[0m\\n    at Object._raise (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:748:17)\\n    at Object.raiseWithData (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:741:17)\\n    at Object.raise (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:735:17)\\n    at ScopeHandler.checkRedeclarationInScope (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:4919:12)\\n    at ScopeHandler.declareName (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:4885:12)\\n    at Object.checkLVal (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:9590:24)\\n    at Object.parseImportSpecifier (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:13293:10)\\n    at Object.parseNamedImportSpecifiers (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:13270:12)\\n    at Object.parseImport (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:13101:39)\\n    at Object.parseStatementContent (D:\\\\winter-study\\\\Frontend-05-Template\\\\Week 16\\\\Carousel\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:11776:27)\");\n\n//# sourceURL=webpack://carousel/./Carousel.js?");

/***/ }),

/***/ "./Framework.js":
/*!**********************!*\
  !*** ./Framework.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createElement\": () => /* binding */ createElement,\n/* harmony export */   \"STATE\": () => /* binding */ STATE,\n/* harmony export */   \"Component\": () => /* binding */ Component\n/* harmony export */ });\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction createElement(type, attributes) {\n  var element;\n  if (typeof type === 'string') element = new ElementWrap(type);else element = new type();\n\n  for (var attrName in attributes) {\n    element.setAttribute(attrName, attributes[attrName]);\n  }\n\n  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    children[_key - 2] = arguments[_key];\n  }\n\n  for (var _i = 0, _children = children; _i < _children.length; _i++) {\n    var child = _children[_i];\n\n    if (typeof child === 'string') {\n      child = new TextWrap(child);\n    }\n\n    element.appendChild(child);\n  }\n\n  return element;\n}\nvar STATE = Symbol('state');\nvar Component = /*#__PURE__*/function () {\n  function Component(type) {\n    _classCallCheck(this, Component);\n\n    // this.root = this.render()\n    this.attributes = Object.create(null);\n  }\n\n  _createClass(Component, [{\n    key: \"setAttribute\",\n    value: function setAttribute(name, value) {\n      this.attributes[name] = value;\n    }\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      child.mountTo(this.root);\n    }\n  }, {\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      if (!this.root) this.render();\n      parent.appendChild(this.root);\n    }\n  }]);\n\n  return Component;\n}();\n\nvar ElementWrap = /*#__PURE__*/function (_Component) {\n  _inherits(ElementWrap, _Component);\n\n  var _super = _createSuper(ElementWrap);\n\n  function ElementWrap(type) {\n    var _this;\n\n    _classCallCheck(this, ElementWrap);\n\n    _this.root = document.createElement(type);\n    return _possibleConstructorReturn(_this);\n  }\n\n  return ElementWrap;\n}(Component);\n\nvar TextWrap = /*#__PURE__*/function (_Component2) {\n  _inherits(TextWrap, _Component2);\n\n  var _super2 = _createSuper(TextWrap);\n\n  function TextWrap(content) {\n    var _this2;\n\n    _classCallCheck(this, TextWrap);\n\n    _this2.root = document.createTextNode(content);\n    return _possibleConstructorReturn(_this2);\n  }\n\n  return TextWrap;\n}(Component);\n\n//# sourceURL=webpack://carousel/./Framework.js?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Framework */ \"./Framework.js\");\n/* harmony import */ var _Carousel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Carousel */ \"./Carousel.js\");\n/* harmony import */ var _Carousel__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Carousel__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Animation */ \"./Animation.js\");\n\n\n\nvar d = ['https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg', 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg', 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg', 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'];\nvar a = (0,_Framework__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Carousel__WEBPACK_IMPORTED_MODULE_1__.Carousel, {\n  src: d\n});\na.mountTo(document.body); // let tl = new Timeline()\n// 把tl挂载到window上，在console里面动态执行tl.add(animation)\n// window.tl = tl\n// window.animation = new Animation({}, 'a', 0, 100, 1000, null)\n// tl.start()\n\n//# sourceURL=webpack://carousel/./main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./main.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
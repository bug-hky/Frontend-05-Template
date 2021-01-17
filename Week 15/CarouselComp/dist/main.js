/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Animation.js":
/*!**********************!*\
  !*** ./Animation.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Timeline\": () => /* binding */ Timeline,\n/* harmony export */   \"Animation\": () => /* binding */ Animation\n/* harmony export */ });\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n// setTimeout\n// setInterval\n// tick\nvar TICK = Symbol('tick');\nvar TICK_HANDLER = Symbol('tick-handler');\nvar ANIMATIONS = Symbol('animations');\nvar START_TIME = Symbol('start-time');\nvar Timeline = /*#__PURE__*/function () {\n  function Timeline() {\n    _classCallCheck(this, Timeline);\n\n    // 添加animation队列\n    this[ANIMATIONS] = new Set();\n    this[START_TIME] = new Map();\n  } // 开始\n\n\n  _createClass(Timeline, [{\n    key: \"start\",\n    value: function start() {\n      var _this = this;\n\n      var startTime = Date.now();\n\n      this[TICK] = function () {\n        // let t = Date.now() - startTime\n        var now = Date.now();\n\n        var _iterator = _createForOfIteratorHelper(_this[ANIMATIONS]),\n            _step;\n\n        try {\n          for (_iterator.s(); !(_step = _iterator.n()).done;) {\n            var animation = _step.value;\n            var t = void 0;\n\n            if (_this[START_TIME].get(animation) < startTime) {\n              t = now - startTime;\n            } else {\n              t = now - _this[START_TIME].get(animation);\n            }\n\n            if (animation.duration < t) {\n              _this[ANIMATIONS][\"delete\"](animation);\n\n              t = animation.duration;\n            }\n\n            animation.receiveTime(t);\n          }\n        } catch (err) {\n          _iterator.e(err);\n        } finally {\n          _iterator.f();\n        }\n\n        requestAnimationFrame(_this[TICK]);\n      };\n\n      this[TICK]();\n    } // 播放速率\n    // set rate(){}\n    // get rate(){}\n\n  }, {\n    key: \"pause\",\n    value: function pause() {} // 暂停\n\n  }, {\n    key: \"resume\",\n    value: function resume() {} // 恢复\n\n  }, {\n    key: \"reset\",\n    value: function reset() {} // 重启\n    // 添加动画\n\n  }, {\n    key: \"add\",\n    value: function add(animation, startTime) {\n      if (arguments.length < 2) {\n        startTime = Date.now();\n      }\n\n      this[ANIMATIONS].add(animation);\n      this[START_TIME].set(animation, startTime);\n    }\n  }]);\n\n  return Timeline;\n}(); // 属性动画：把一个对象的某个属性从一个值变成另外一个值\n// 帧动画：每一秒来一张图片\n\nvar Animation = /*#__PURE__*/function () {\n  /**\r\n   * object, property, startValue, endValue, duration这五个属性是必选参数\r\n   * timingFunction差值函数\r\n   * */\n  function Animation(object, property, startValue, endValue, duration, delay, timingFunction, template) {\n    _classCallCheck(this, Animation);\n\n    this.object = object;\n    this.property = property;\n    this.startValue = startValue;\n    this.endValue = endValue;\n    this.duration = duration;\n    this.timingFunction = timingFunction;\n    this.delay = delay;\n    this.template = template;\n  }\n\n  _createClass(Animation, [{\n    key: \"receiveTime\",\n    value: function receiveTime(time) {\n      console.info('time =>', this.object[this.property]);\n      var range = this.endValue - this.startValue;\n      this.object[this.property] = this.template(this.startValue + range * time / this.duration);\n    }\n  }]);\n\n  return Animation;\n}();\n\n//# sourceURL=webpack://carousel/./Animation.js?");

/***/ }),

/***/ "./AnimationDemo.js":
/*!**************************!*\
  !*** ./AnimationDemo.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animation */ \"./Animation.js\");\n\nvar tl = new _Animation__WEBPACK_IMPORTED_MODULE_0__.Timeline();\ntl.start();\ntl.add(new _Animation__WEBPACK_IMPORTED_MODULE_0__.Animation(document.querySelector('#el').style, // DOM element\n'transform', // property\n0, // startValue\n100, // endValue\n1000, // duration\n0, // delay\nnull, // timingFunction\nfunction (v) {\n  return \"translateX(\".concat(v, \"px)\");\n} // template\n));\n\n//# sourceURL=webpack://carousel/./AnimationDemo.js?");

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
/******/ 	__webpack_require__("./AnimationDemo.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
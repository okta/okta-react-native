"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.createOktaAuthBase = createOktaAuthBase;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _util = require("../util");
var features = _interopRequireWildcard(require("../features"));
var constants = _interopRequireWildcard(require("../constants"));
var _tinyEmitter = _interopRequireDefault(require("tiny-emitter"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Do not use this type in code, so it won't be emitted in the declaration output

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 
// Do not use this type in code, so it won't be emitted in the declaration output

function createOktaAuthBase(OptionsConstructor) {
  class OktaAuthBase {
    constructor(...args) {
      const options = new OptionsConstructor(args.length ? args[0] || {} : {});
      this.options = (0, _util.removeNils)(options); // clear out undefined values
      this.emitter = new _tinyEmitter.default();
      this.features = features;
    }
  }

  // Hoist feature detection functions to prototype & static type
  (0, _defineProperty2.default)(OktaAuthBase, "features", features);
  (0, _defineProperty2.default)(OktaAuthBase, "constants", constants);
  OktaAuthBase.features = OktaAuthBase.prototype.features = features;

  // Also hoist constants for CommonJS users
  Object.assign(OktaAuthBase, {
    constants
  });
  return OktaAuthBase;
}
//# sourceMappingURL=factory.js.map
"use strict";

exports.mixinMyAccount = mixinMyAccount;
var MyAccountMethods = _interopRequireWildcard(require("./api"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function mixinMyAccount(Base) {
  return class OktaAuthMyAccount extends Base {
    constructor(...args) {
      super(...args);
      this.myaccount = Object.entries(MyAccountMethods).filter(([name]) => name !== 'default').reduce((acc, [name, fn]) => {
        acc[name] = fn.bind(null, this);
        return acc;
      }, {});
    }
  };
}
//# sourceMappingURL=mixin.js.map
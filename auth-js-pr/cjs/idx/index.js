"use strict";

var _exportNames = {
  authenticate: true,
  cancel: true,
  handleEmailVerifyCallback: true,
  isEmailVerifyCallback: true,
  parseEmailVerifyCallback: true,
  isEmailVerifyCallbackError: true,
  interact: true,
  introspect: true,
  poll: true,
  proceed: true,
  canProceed: true,
  register: true,
  recoverPassword: true,
  handleInteractionCodeRedirect: true,
  startTransaction: true,
  unlockAccount: true
};
Object.defineProperty(exports, "authenticate", {
  enumerable: true,
  get: function () {
    return _authenticate.authenticate;
  }
});
Object.defineProperty(exports, "canProceed", {
  enumerable: true,
  get: function () {
    return _proceed.canProceed;
  }
});
Object.defineProperty(exports, "cancel", {
  enumerable: true,
  get: function () {
    return _cancel.cancel;
  }
});
Object.defineProperty(exports, "handleEmailVerifyCallback", {
  enumerable: true,
  get: function () {
    return _emailVerify.handleEmailVerifyCallback;
  }
});
Object.defineProperty(exports, "handleInteractionCodeRedirect", {
  enumerable: true,
  get: function () {
    return _handleInteractionCodeRedirect.handleInteractionCodeRedirect;
  }
});
Object.defineProperty(exports, "interact", {
  enumerable: true,
  get: function () {
    return _interact.interact;
  }
});
Object.defineProperty(exports, "introspect", {
  enumerable: true,
  get: function () {
    return _introspect.introspect;
  }
});
Object.defineProperty(exports, "isEmailVerifyCallback", {
  enumerable: true,
  get: function () {
    return _emailVerify.isEmailVerifyCallback;
  }
});
Object.defineProperty(exports, "isEmailVerifyCallbackError", {
  enumerable: true,
  get: function () {
    return _emailVerify.isEmailVerifyCallbackError;
  }
});
Object.defineProperty(exports, "parseEmailVerifyCallback", {
  enumerable: true,
  get: function () {
    return _emailVerify.parseEmailVerifyCallback;
  }
});
Object.defineProperty(exports, "poll", {
  enumerable: true,
  get: function () {
    return _poll.poll;
  }
});
Object.defineProperty(exports, "proceed", {
  enumerable: true,
  get: function () {
    return _proceed.proceed;
  }
});
Object.defineProperty(exports, "recoverPassword", {
  enumerable: true,
  get: function () {
    return _recoverPassword.recoverPassword;
  }
});
Object.defineProperty(exports, "register", {
  enumerable: true,
  get: function () {
    return _register.register;
  }
});
Object.defineProperty(exports, "startTransaction", {
  enumerable: true,
  get: function () {
    return _startTransaction.startTransaction;
  }
});
Object.defineProperty(exports, "unlockAccount", {
  enumerable: true,
  get: function () {
    return _unlockAccount.unlockAccount;
  }
});
var _authenticate = require("./authenticate");
var _cancel = require("./cancel");
var _emailVerify = require("./emailVerify");
var _interact = require("./interact");
var _introspect = require("./introspect");
var _poll = require("./poll");
var _proceed = require("./proceed");
var _register = require("./register");
var _recoverPassword = require("./recoverPassword");
var _handleInteractionCodeRedirect = require("./handleInteractionCodeRedirect");
var _startTransaction = require("./startTransaction");
var _unlockAccount = require("./unlockAccount");
var _transactionMeta = require("./transactionMeta");
Object.keys(_transactionMeta).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _transactionMeta[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _transactionMeta[key];
    }
  });
});
var _factory = require("./factory");
Object.keys(_factory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _factory[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _factory[key];
    }
  });
});
var _mixin = require("./mixin");
Object.keys(_mixin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mixin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mixin[key];
    }
  });
});
var _options = require("./options");
Object.keys(_options).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _options[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _options[key];
    }
  });
});
var _storage = require("./storage");
Object.keys(_storage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _storage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _storage[key];
    }
  });
});
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _IdxTransactionManager = require("./IdxTransactionManager");
Object.keys(_IdxTransactionManager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _IdxTransactionManager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _IdxTransactionManager[key];
    }
  });
});
//# sourceMappingURL=index.js.map
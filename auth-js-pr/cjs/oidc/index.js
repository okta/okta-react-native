"use strict";

var _exportNames = {
  decodeToken: true,
  revokeToken: true,
  renewToken: true,
  renewTokensWithRefresh: true,
  renewTokens: true,
  verifyToken: true,
  getUserInfo: true,
  handleOAuthResponse: true,
  exchangeCodeForTokens: true,
  getToken: true,
  getWithoutPrompt: true,
  getWithPopup: true,
  getWithRedirect: true,
  parseFromUrl: true
};
Object.defineProperty(exports, "decodeToken", {
  enumerable: true,
  get: function () {
    return _decodeToken.decodeToken;
  }
});
Object.defineProperty(exports, "exchangeCodeForTokens", {
  enumerable: true,
  get: function () {
    return _exchangeCodeForTokens.exchangeCodeForTokens;
  }
});
Object.defineProperty(exports, "getToken", {
  enumerable: true,
  get: function () {
    return _getToken.getToken;
  }
});
Object.defineProperty(exports, "getUserInfo", {
  enumerable: true,
  get: function () {
    return _getUserInfo.getUserInfo;
  }
});
Object.defineProperty(exports, "getWithPopup", {
  enumerable: true,
  get: function () {
    return _getWithPopup.getWithPopup;
  }
});
Object.defineProperty(exports, "getWithRedirect", {
  enumerable: true,
  get: function () {
    return _getWithRedirect.getWithRedirect;
  }
});
Object.defineProperty(exports, "getWithoutPrompt", {
  enumerable: true,
  get: function () {
    return _getWithoutPrompt.getWithoutPrompt;
  }
});
Object.defineProperty(exports, "handleOAuthResponse", {
  enumerable: true,
  get: function () {
    return _handleOAuthResponse.handleOAuthResponse;
  }
});
Object.defineProperty(exports, "parseFromUrl", {
  enumerable: true,
  get: function () {
    return _parseFromUrl.parseFromUrl;
  }
});
Object.defineProperty(exports, "renewToken", {
  enumerable: true,
  get: function () {
    return _renewToken.renewToken;
  }
});
Object.defineProperty(exports, "renewTokens", {
  enumerable: true,
  get: function () {
    return _renewTokens.renewTokens;
  }
});
Object.defineProperty(exports, "renewTokensWithRefresh", {
  enumerable: true,
  get: function () {
    return _renewTokensWithRefresh.renewTokensWithRefresh;
  }
});
Object.defineProperty(exports, "revokeToken", {
  enumerable: true,
  get: function () {
    return _revokeToken.revokeToken;
  }
});
Object.defineProperty(exports, "verifyToken", {
  enumerable: true,
  get: function () {
    return _verifyToken.verifyToken;
  }
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
var _endpoints = require("./endpoints");
Object.keys(_endpoints).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _endpoints[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _endpoints[key];
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
var _TokenManager = require("./TokenManager");
Object.keys(_TokenManager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _TokenManager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _TokenManager[key];
    }
  });
});
var _TransactionManager = require("./TransactionManager");
Object.keys(_TransactionManager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _TransactionManager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _TransactionManager[key];
    }
  });
});
var _util = require("./util");
Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _util[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _util[key];
    }
  });
});
var _decodeToken = require("./decodeToken");
var _revokeToken = require("./revokeToken");
var _renewToken = require("./renewToken");
var _renewTokensWithRefresh = require("./renewTokensWithRefresh");
var _renewTokens = require("./renewTokens");
var _verifyToken = require("./verifyToken");
var _getUserInfo = require("./getUserInfo");
var _handleOAuthResponse = require("./handleOAuthResponse");
var _exchangeCodeForTokens = require("./exchangeCodeForTokens");
var _getToken = require("./getToken");
var _getWithoutPrompt = require("./getWithoutPrompt");
var _getWithPopup = require("./getWithPopup");
var _getWithRedirect = require("./getWithRedirect");
var _parseFromUrl = require("./parseFromUrl");
//# sourceMappingURL=index.js.map
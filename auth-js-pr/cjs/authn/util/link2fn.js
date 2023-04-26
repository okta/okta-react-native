"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.link2fn = link2fn;
var _util = require("../../util");
var _AuthSdkError = _interopRequireDefault(require("../../errors/AuthSdkError"));
var _http = require("../../http");
var _api = require("../api");
var _stateToken = require("./stateToken");
// eslint-disable-next-line max-params
function link2fn(sdk, tx, res, obj, link, ref) {
  if (Array.isArray(link)) {
    return function (name, opts) {
      if (!name) {
        throw new _AuthSdkError.default('Must provide a link name');
      }
      var lk = (0, _util.find)(link, {
        name: name
      });
      if (!lk) {
        throw new _AuthSdkError.default('No link found for that name');
      }
      return link2fn(sdk, tx, res, obj, lk, ref)(opts);
    };
  } else if (link.hints && link.hints.allow && link.hints.allow.length === 1) {
    var method = link.hints.allow[0];
    switch (method) {
      case 'GET':
        return function () {
          return (0, _http.get)(sdk, link.href, {
            withCredentials: true
          });
        };
      case 'POST':
        // eslint-disable-next-line max-statements,complexity
        return function (opts) {
          if (ref && ref.isPolling) {
            ref.isPolling = false;
          }
          var data = (0, _stateToken.addStateToken)(res, opts);
          if (res.status === 'MFA_ENROLL' || res.status === 'FACTOR_ENROLL') {
            // Add factorType and provider
            Object.assign(data, {
              factorType: obj.factorType,
              provider: obj.provider
            });
          }
          var params = {};
          var autoPush = data.autoPush;
          if (autoPush !== undefined) {
            if (typeof autoPush === 'function') {
              try {
                params.autoPush = !!autoPush();
              } catch (e) {
                return Promise.reject(new _AuthSdkError.default('AutoPush resulted in an error.'));
              }
            } else if (autoPush !== null) {
              params.autoPush = !!autoPush;
            }
            data = (0, _util.omit)(data, 'autoPush');
          }
          var rememberDevice = data.rememberDevice;
          if (rememberDevice !== undefined) {
            if (typeof rememberDevice === 'function') {
              try {
                params.rememberDevice = !!rememberDevice();
              } catch (e) {
                return Promise.reject(new _AuthSdkError.default('RememberDevice resulted in an error.'));
              }
            } else if (rememberDevice !== null) {
              params.rememberDevice = !!rememberDevice;
            }
            data = (0, _util.omit)(data, 'rememberDevice');
          } else if (data.profile && data.profile.updatePhone !== undefined) {
            if (data.profile.updatePhone) {
              params.updatePhone = true;
            }
            data.profile = (0, _util.omit)(data.profile, 'updatePhone');
          }
          var href = link.href + (0, _util.toQueryString)(params);
          return (0, _api.postToTransaction)(sdk, tx, href, data);
        };
    }
  }
}
//# sourceMappingURL=link2fn.js.map
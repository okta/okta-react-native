"use strict";

exports.mixinHttp = mixinHttp;
var _OktaUserAgent = require("./OktaUserAgent");
var _headers = require("./headers");
var _util = require("../util");
var _request = require("./request");
function mixinHttp(Base) {
  return class OktaAuthHttp extends Base {
    constructor(...args) {
      super(...args);
      this._oktaUserAgent = new _OktaUserAgent.OktaUserAgent();

      // HTTP
      this.http = {
        setRequestHeader: _headers.setRequestHeader.bind(null, this)
      };
    }
    setHeaders(headers) {
      this.options.headers = Object.assign({}, this.options.headers, headers);
    }
    getIssuerOrigin() {
      // Infer the URL from the issuer URL, omitting the /oauth2/{authServerId}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.options.issuer.split('/oauth2/')[0];
    }
    webfinger(opts) {
      var url = '/.well-known/webfinger' + (0, _util.toQueryString)(opts);
      var options = {
        headers: {
          'Accept': 'application/jrd+json'
        }
      };
      return (0, _request.get)(this, url, options);
    }
  };
}
//# sourceMappingURL=mixin.js.map
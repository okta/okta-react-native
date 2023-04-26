"use strict";

exports.links2fns = links2fns;
var _link2fn = require("./link2fn");
var _poll = require("./poll");
function links2fns(sdk, tx, res, obj, ref) {
  var fns = {};
  for (var linkName in obj._links) {
    if (!Object.prototype.hasOwnProperty.call(obj._links, linkName)) {
      continue;
    }
    var link = obj._links[linkName];
    if (linkName === 'next') {
      linkName = link.name;
    }
    if (link.type) {
      fns[linkName] = link;
      continue;
    }
    switch (linkName) {
      // poll is only found at the transaction
      // level, so we don't need to pass the link
      case 'poll':
        fns.poll = (0, _poll.getPollFn)(sdk, res, ref);
        break;
      default:
        var fn = (0, _link2fn.link2fn)(sdk, tx, res, obj, link, ref);
        if (fn) {
          fns[linkName] = fn;
        }
    }
  }
  return fns;
}
//# sourceMappingURL=links2fns.js.map
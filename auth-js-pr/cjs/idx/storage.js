"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.createIdxStorageManager = createIdxStorageManager;
var _storage = require("../storage");
var _constants = require("../constants");
var _storage2 = require("../core/storage");
var _features = require("../features");
var _util = require("../util");
var _AuthSdkError = _interopRequireDefault(require("../errors/AuthSdkError"));
function createIdxStorageManager() {
  const CoreStorageManager = (0, _storage2.createCoreStorageManager)();
  return class IdxStorageManager extends CoreStorageManager {
    constructor(storageManagerOptions, cookieOptions, storageUtil) {
      super(storageManagerOptions, cookieOptions, storageUtil);
    }

    // intermediate idxResponse
    // store for network traffic optimazation purpose
    // TODO: revisit in auth-js 6.0 epic JIRA: OKTA-399791
    getIdxResponseStorage(options) {
      let storage;
      if ((0, _features.isBrowser)()) {
        // on browser side only use memory storage 
        try {
          storage = this.storageUtil.getStorageByType('memory', options);
        } catch (e) {
          // it's ok to miss response storage
          // eslint-disable-next-line max-len
          (0, _util.warn)('No response storage found, you may want to provide custom implementation for intermediate idx responses to optimize the network traffic');
        }
      } else {
        // on server side re-use transaction custom storage
        const transactionStorage = this.getTransactionStorage(options);
        if (transactionStorage) {
          storage = {
            getItem: key => {
              const transaction = transactionStorage.getStorage();
              if (transaction && transaction[key]) {
                return transaction[key];
              }
              return null;
            },
            setItem: (key, val) => {
              const transaction = transactionStorage.getStorage();
              if (!transaction) {
                throw new _AuthSdkError.default('Transaction has been cleared, failed to save idxState');
              }
              transaction[key] = val;
              transactionStorage.setStorage(transaction);
            },
            removeItem: key => {
              const transaction = transactionStorage.getStorage();
              if (!transaction) {
                return;
              }
              delete transaction[key];
              transactionStorage.setStorage(transaction);
            }
          };
        }
      }
      if (!storage) {
        return null;
      }
      return new _storage.SavedObject(storage, _constants.IDX_RESPONSE_STORAGE_NAME);
    }
  };
}
//# sourceMappingURL=storage.js.map
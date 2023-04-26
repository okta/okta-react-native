/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */

const isFieldMutable = function isFieldMutable(field) {
    return (field.mutable !== false);
};
const divideSingleActionParamsByMutability = function divideSingleActionParamsByMutability(action) {
    var _a, _b;
    const defaultParamsForAction = {};
    const neededParamsForAction = [];
    const immutableParamsForAction = {};
    if (!action.value) {
        neededParamsForAction.push(action);
        return { defaultParamsForAction, neededParamsForAction, immutableParamsForAction };
    }
    for (let field of action.value) {
        if (isFieldMutable(field)) {
            neededParamsForAction.push(field);
            if ((_a = field.value) !== null && _a !== void 0 ? _a : false) {
                defaultParamsForAction[field.name] = field.value;
            }
        }
        else {
            immutableParamsForAction[field.name] = (_b = field.value) !== null && _b !== void 0 ? _b : '';
        }
    }
    return { defaultParamsForAction, neededParamsForAction, immutableParamsForAction };
};
const divideActionParamsByMutability = function divideActionParamsByMutability(actionList) {
    actionList = Array.isArray(actionList) ? actionList : [actionList];
    const neededParams = [];
    const defaultParams = {};
    const immutableParams = {};
    for (let action of actionList) {
        const { defaultParamsForAction, neededParamsForAction, immutableParamsForAction } = divideSingleActionParamsByMutability(action);
        neededParams.push(neededParamsForAction);
        defaultParams[action.name] = defaultParamsForAction;
        immutableParams[action.name] = immutableParamsForAction;
    }
    return { defaultParams, neededParams, immutableParams };
};

export { divideActionParamsByMutability };
//# sourceMappingURL=actionParser.js.map

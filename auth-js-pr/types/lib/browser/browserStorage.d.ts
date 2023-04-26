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
 *
 */
import Cookies from 'js-cookie';
import { StorageOptions, SimpleStorage, StorageType, StorageUtil } from '../storage/types';
export interface CookieStorage extends SimpleStorage {
    setItem(key: string, value: any, expiresAt?: string | null): void;
    getItem(key?: string): any;
    removeItem(key: string): any;
}
export interface BrowserStorageUtil extends StorageUtil {
    browserHasLocalStorage(): boolean;
    browserHasSessionStorage(): boolean;
    getStorageByType(storageType: StorageType, options: StorageOptions): SimpleStorage;
    getLocalStorage(): Storage;
    getSessionStorage(): Storage;
    getInMemoryStorage(): SimpleStorage;
    getCookieStorage(options?: StorageOptions): CookieStorage;
    testStorage(storage: any): boolean;
    storage: Cookies;
    inMemoryStore: Record<string, unknown>;
}
declare var storageUtil: BrowserStorageUtil;
export default storageUtil;

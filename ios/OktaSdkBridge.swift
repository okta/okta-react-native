/*
 * Copyright (c) 2019-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import Foundation
import OktaOidc

// MARK: - OktaOidcProtocol

protocol OktaOidcProtocol: class {
    var configuration: OktaOidcConfig { get }
    
    func signInWithBrowser(from presenter: UIViewController,
                           additionalParameters: [String : String],
                           callback: @escaping ((OktaOidcStateManager?, Error?) -> Void))
    
    func signOutOfOkta(_ authStateManager: OktaOidcStateManager,
                       from presenter: UIViewController,
                       callback: @escaping ((Error?) -> Void))
    
    func authenticate(withSessionToken sessionToken: String,
                      callback: @escaping ((OktaOidcStateManager?, Error?) -> Void))
}

extension OktaOidc: OktaOidcProtocol {
    
}

// MARK: - StateManagerProtocol

protocol StateManagerProtocol: class {
    var accessToken: String? { get }
    var idToken: String? { get }
    var refreshToken: String? { get }

    func getUser(_ callback: @escaping ([String:Any]?, Error?) -> Void)
    func renew(callback: @escaping ((OktaOidcStateManager?, Error?) -> Void))
    func revoke(_ token: String?, callback: @escaping (Bool, Error?) -> Void)
    func introspect(token: String?, callback: @escaping ([String : Any]?, Error?) -> Void)
    func clear()
}

extension OktaOidcStateManager: StateManagerProtocol {
    
}

// MARK: - OktaSdkBridge

@objc(OktaSdkBridge)
class OktaSdkBridge: RCTEventEmitter {
    var config: OktaOidcConfig? {
        oktaOidc?.configuration
    }
    
    var storedStateManager: StateManagerProtocol? {
        guard let config = config else {
            print(OktaOidcError.notConfigured.errorDescription ?? "The SDK is not configured.")
            return nil
        }
        
        return OktaOidcStateManager.readFromSecureStorage(for: config)
    }
    
    private(set) var oktaOidc: OktaOidcProtocol?
    
    override var methodQueue: DispatchQueue { .main }
    
    init(oidc: OktaOidcProtocol? = nil) {
        self.oktaOidc = oidc
    }
    
    func presentedViewController() -> UIViewController? {
        RCTPresentedViewController()
    }
    
    @objc
    func createConfig(_ clientId: String,
                      redirectUrl: String,
                      endSessionRedirectUri: String,
                      discoveryUri: String,
                      scopes: String,
                      userAgentTemplate: String,
                      promiseResolver: RCTPromiseResolveBlock,
                      promiseRejecter: RCTPromiseRejectBlock) {
        do {
            let uaVersion = OktaUserAgent.userAgentVersion()
            let userAgent = userAgentTemplate.replacingOccurrences(of: "$UPSTREAM_SDK", with: "okta-oidc-ios/\(uaVersion)")
            OktaOidcConfig.setUserAgent(value: userAgent)
            let config = try OktaOidcConfig(with: [
                "issuer": discoveryUri,
                "clientId": clientId,
                "redirectUri": redirectUrl,
                "logoutRedirectUri": endSessionRedirectUri,
                "scopes": scopes
            ])
            oktaOidc = try OktaOidc(configuration: config)
            promiseResolver(true)
        } catch let error {
            promiseRejecter(OktaReactNativeError.oktaOidcError.errorCode, error.localizedDescription, error)
        }
    }
    
    @objc
    func signIn(_ options: [String: String] = [:]) {
        guard let currOktaOidc = oktaOidc else {
            let error = OktaReactNativeError.notConfigured
            let errorDic = [
                OktaSdkConstant.ERROR_CODE_KEY: error.errorCode,
                OktaSdkConstant.ERROR_MSG_KEY: error.errorDescription
            ]
            sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
            return
        }
        
        guard let view = presentedViewController() else {
            let error = OktaReactNativeError.noView
            let errorDic = [
                OktaSdkConstant.ERROR_CODE_KEY: error.errorCode,
                OktaSdkConstant.ERROR_MSG_KEY: error.errorDescription
            ]
            sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
            return
        }
        
        if #available(iOS 13.0, *) {
            let noSSOEnabled = options["noSSO"] == "true"
            config?.noSSO = noSSOEnabled
        }
        
        currOktaOidc.signInWithBrowser(from: view, additionalParameters: options) { stateManager, error in
            if let error = error {
                let errorDic = [
                    OktaSdkConstant.ERROR_CODE_KEY: OktaReactNativeError.oktaOidcError.errorCode,
                    OktaSdkConstant.ERROR_MSG_KEY: error.localizedDescription
                ]
                self.sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
                return
            }
            
            guard let currStateManager = stateManager else {
                let error = OktaReactNativeError.noStateManager
                let errorDic = [
                    OktaSdkConstant.ERROR_CODE_KEY: error.errorCode,
                    OktaSdkConstant.ERROR_MSG_KEY: error.errorDescription
                ]
                self.sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
                return
            }
            
            currStateManager.writeToSecureStorage()
            let dic = [
                OktaSdkConstant.RESOLVE_TYPE_KEY: OktaSdkConstant.AUTHORIZED,
                OktaSdkConstant.ACCESS_TOKEN_KEY: stateManager?.accessToken
            ]
            
            self.sendEvent(withName: OktaSdkConstant.SIGN_IN_SUCCESS, body: dic)
        }
    }
    
    @objc
    func signOut() {
        guard let currOktaOidc = oktaOidc else {
            let error = OktaReactNativeError.notConfigured
            let errorDic = [
                OktaSdkConstant.ERROR_CODE_KEY: error.errorCode,
                OktaSdkConstant.ERROR_MSG_KEY: error.errorDescription
            ]
            sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
            return
        }
        
        guard let view = presentedViewController() else {
            let error = OktaReactNativeError.noView
            let errorDic = [
                OktaSdkConstant.ERROR_CODE_KEY: error.errorCode,
                OktaSdkConstant.ERROR_MSG_KEY: error.errorDescription
            ]
            sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
            return
        }
        
        guard let stateManager = storedStateManager as? OktaOidcStateManager else {
            let error = OktaReactNativeError.unauthenticated
            let errorDic = [
                OktaSdkConstant.ERROR_CODE_KEY: error.errorCode,
                OktaSdkConstant.ERROR_MSG_KEY: error.errorDescription
            ]
            sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
            return
        }
        
        currOktaOidc.signOutOfOkta(stateManager, from: view) { error in
            if let error = error {
                let errorDic = [
                    OktaSdkConstant.ERROR_CODE_KEY: OktaReactNativeError.oktaOidcError.errorCode,
                    OktaSdkConstant.ERROR_MSG_KEY: error.localizedDescription
                ]
                self.sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
                return
            }
            
            let dic = [
                OktaSdkConstant.RESOLVE_TYPE_KEY: OktaSdkConstant.SIGNED_OUT
            ]
            stateManager.clear()
            
            self.sendEvent(withName: OktaSdkConstant.SIGN_OUT_SUCCESS, body: dic)
        }
    }
    
    @objc
    func authenticate(_ sessionToken: String,
                      promiseResolver: @escaping RCTPromiseResolveBlock,
                      promiseRejecter: @escaping RCTPromiseRejectBlock) {
        guard config != nil, let currOktaOidc = oktaOidc else {
            let error = OktaReactNativeError.notConfigured
            let errorDic = [
                OktaSdkConstant.ERROR_CODE_KEY: error.errorCode,
                OktaSdkConstant.ERROR_MSG_KEY: error.errorDescription
            ]
            sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
            promiseRejecter(errorDic[OktaSdkConstant.ERROR_CODE_KEY]!, 
                            errorDic[OktaSdkConstant.ERROR_MSG_KEY]!, error)
            return
        }
        
        currOktaOidc.authenticate(withSessionToken: sessionToken) { stateManager, error in
            if let error = error {
                let errorDic = [
                    OktaSdkConstant.ERROR_CODE_KEY: OktaReactNativeError.oktaOidcError.errorCode,
                    OktaSdkConstant.ERROR_MSG_KEY: error.localizedDescription
                ]
                self.sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
                promiseRejecter(errorDic[OktaSdkConstant.ERROR_CODE_KEY]!, 
                                errorDic[OktaSdkConstant.ERROR_MSG_KEY]!, error)
                return
            }
            
            guard let currStateManager = stateManager else {
                let error = OktaReactNativeError.noStateManager
                let errorDic = [
                    OktaSdkConstant.ERROR_CODE_KEY: error.errorCode,
                    OktaSdkConstant.ERROR_MSG_KEY: error.errorDescription
                ]
                self.sendEvent(withName: OktaSdkConstant.ON_ERROR, body: errorDic)
                promiseRejecter(errorDic[OktaSdkConstant.ERROR_CODE_KEY]!, 
                                errorDic[OktaSdkConstant.ERROR_MSG_KEY]!, error)
                return
            }

            currStateManager.writeToSecureStorage()
            let dic = [
                OktaSdkConstant.RESOLVE_TYPE_KEY: OktaSdkConstant.AUTHORIZED,
                OktaSdkConstant.ACCESS_TOKEN_KEY: stateManager?.accessToken
            ]
            
            self.sendEvent(withName: OktaSdkConstant.SIGN_IN_SUCCESS, body: dic)
            promiseResolver(dic)
        }
    }
    
    @objc(getAccessToken:promiseRejecter:)
    func getAccessToken(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        guard let stateManager = storedStateManager else {
            let error = OktaReactNativeError.unauthenticated
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }
        
        guard let accessToken = stateManager.accessToken else {
            let error = OktaReactNativeError.noAccessToken
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }
        
        let dic = [
            OktaSdkConstant.ACCESS_TOKEN_KEY: accessToken
        ]
        
        promiseResolver(dic)
    }
    
    @objc(getIdToken:promiseRejecter:)
    func getIdToken(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {        
        guard let stateManager = storedStateManager else {
            let error = OktaReactNativeError.unauthenticated
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }
        
        guard let idToken = stateManager.idToken else {
            let error = OktaReactNativeError.noIdToken
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }
        
        let dic = [
            OktaSdkConstant.ID_TOKEN_KEY: idToken
        ]
        
        promiseResolver(dic)
        return
    }
    
    @objc(getUser:promiseRejecter:)
    func getUser(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        guard let stateManager = storedStateManager else {
            let error = OktaReactNativeError.unauthenticated
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }
        
        stateManager.getUser { response, error in
            if let error = error {
                promiseRejecter(OktaReactNativeError.oktaOidcError.errorCode, error.localizedDescription, error)
                return
            }
            
            promiseResolver(response)
        }
    }
    
    @objc(isAuthenticated:promiseRejecter:)
    func isAuthenticated(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        var promiseResult = [
            OktaSdkConstant.AUTHENTICATED_KEY: false
        ]
        
        guard let stateManager = storedStateManager else {
            promiseResolver(promiseResult)
            return
        }
        
        // State Manager returns non expired (fresh) tokens.
        let areTokensValidAndFresh = stateManager.idToken != nil && stateManager.accessToken != nil
        promiseResult[OktaSdkConstant.AUTHENTICATED_KEY] = areTokensValidAndFresh
        
        promiseResolver(promiseResult)
    }
    
    @objc(revokeAccessToken:promiseRejecter:)
    func revokeAccessToken(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        revokeToken(tokenName: OktaSdkConstant.ACCESS_TOKEN_KEY, promiseResolver: promiseResolver, promiseRejecter: promiseRejecter)
    }
    
    @objc(revokeIdToken:promiseRejecter:)
    func revokeIdToken(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        revokeToken(tokenName: OktaSdkConstant.ID_TOKEN_KEY, promiseResolver: promiseResolver, promiseRejecter: promiseRejecter)
    }
    
    @objc(revokeRefreshToken:promiseRejecter:)
    func revokeRefreshToken(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        revokeToken(tokenName: OktaSdkConstant.REFRESH_TOKEN_KEY, promiseResolver: promiseResolver, promiseRejecter: promiseRejecter)
    }
    
    @objc(introspectAccessToken:promiseRejecter:)
    func introspectAccessToken(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        introspectToken(tokenName: OktaSdkConstant.ACCESS_TOKEN_KEY, promiseResolver: promiseResolver, promiseRejecter: promiseRejecter)
    }
    
    @objc(introspectIdToken:promiseRejecter:)
    func introspectIdToken(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        introspectToken(tokenName: OktaSdkConstant.ID_TOKEN_KEY, promiseResolver: promiseResolver, promiseRejecter: promiseRejecter)
    }
    
    @objc(introspectRefreshToken:promiseRejecter:)
    func introspectRefreshToken(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        introspectToken(tokenName: OktaSdkConstant.REFRESH_TOKEN_KEY, promiseResolver: promiseResolver, promiseRejecter: promiseRejecter)
    }
    
    @objc(refreshTokens:promiseRejecter:)
    func refreshTokens(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        guard let stateManager = storedStateManager else {
            let error = OktaReactNativeError.unauthenticated
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }

        stateManager.renew { newAccessToken, error in
            if let error = error {
                promiseRejecter(OktaReactNativeError.oktaOidcError.errorCode, error.localizedDescription, error)
                return
            }
            
            guard let newStateManager = newAccessToken else {
                let error = OktaReactNativeError.noStateManager
                promiseRejecter(error.errorCode, error.errorDescription, error)
                return
            }
            
            newStateManager.writeToSecureStorage()
            let dic = [
                OktaSdkConstant.ACCESS_TOKEN_KEY: newStateManager.accessToken,
                OktaSdkConstant.ID_TOKEN_KEY: newStateManager.idToken,
                OktaSdkConstant.REFRESH_TOKEN_KEY: newStateManager.refreshToken
            ]
            
            promiseResolver(dic)
        }
    }

    @objc(clearTokens:promiseRejecter:)
    func clearTokens(promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        guard let stateManager = storedStateManager else {
            let error = OktaReactNativeError.unauthenticated
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }

        stateManager.clear()
        promiseResolver(true)
    }

    func introspectToken(tokenName: String, promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        guard let stateManager = storedStateManager else {
            let error = OktaReactNativeError.unauthenticated
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }
        
        var token: String?
        
        switch tokenName {
        case OktaSdkConstant.ACCESS_TOKEN_KEY:
            token = stateManager.accessToken
        case OktaSdkConstant.ID_TOKEN_KEY:
            token = stateManager.idToken
        case OktaSdkConstant.REFRESH_TOKEN_KEY:
            token = stateManager.refreshToken
        default:
            assertionFailure("Incorrect token name.")
            let error = OktaReactNativeError.errorTokenType
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }
        
        stateManager.introspect(token: token) { payload, error in
            if let error = error {
                promiseRejecter(OktaReactNativeError.oktaOidcError.errorCode, error.localizedDescription, error)
                return
            }
            
            guard let payload = payload else {
                let error = OktaReactNativeError.errorPayload
                promiseRejecter(error.errorCode, error.errorDescription, error)
                return
            }
            
            promiseResolver(payload)
        }
    }
    
    func revokeToken(tokenName: String, promiseResolver: @escaping RCTPromiseResolveBlock, promiseRejecter: @escaping RCTPromiseRejectBlock) {
        guard let stateManager = storedStateManager else {
            let error = OktaReactNativeError.unauthenticated
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }
        
        var token: String?
        
        switch tokenName {
        case OktaSdkConstant.ACCESS_TOKEN_KEY:
            token = stateManager.accessToken
        case OktaSdkConstant.ID_TOKEN_KEY:
            token = stateManager.idToken
        case OktaSdkConstant.REFRESH_TOKEN_KEY:
            token = stateManager.refreshToken
        default:
            let error = OktaReactNativeError.errorTokenType
            promiseRejecter(error.errorCode, error.errorDescription, error)
            return
        }
        
        stateManager.revoke(token) { response, error in
            if let error = error {
                promiseRejecter(OktaReactNativeError.oktaOidcError.errorCode, error.localizedDescription, error)
                return
            }
            
            promiseResolver(true)
        }
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String]! {
        return [
            OktaSdkConstant.SIGN_IN_SUCCESS,
            OktaSdkConstant.SIGN_OUT_SUCCESS,
            OktaSdkConstant.ON_ERROR,
            OktaSdkConstant.ON_CANCELLED
        ]
    }
}

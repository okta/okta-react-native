/*
 * Copyright (c) 2021-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import XCTest
import OktaOidc
@testable import ReactNativeOktaSdkBridge

extension OktaOidcStateManager {
    // expires in 2037
    static let mockIdToken = """
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cuZXhhbXBsZS5jb20iLCJpYXQiOjE2MTg0NzU1ODMsImV4cCI6MjEyMzM5NzE4MywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20ifQ.WY2K4adyY9p--NN83REjZzZglUI7JjxPNvmI3VigGFo
    """
    
    static let mockAccessToken = mockIdToken
    
    static func makeOidcStateManager(with configuration: OktaOidcConfig) -> OktaOidcStateManager {
        let serviceConfig = OKTServiceConfiguration(authorizationEndpoint: URL(string: configuration.issuer)!,
                                                    tokenEndpoint: URL(string: configuration.issuer)!,
                                                    issuer: URL(string: configuration.issuer)!)
        
        let mockTokenRequest = OKTTokenRequest(configuration: serviceConfig,
                                               grantType: OKTGrantTypeRefreshToken,
                                               authorizationCode: nil,
                                               redirectURL: configuration.redirectUri,
                                               clientID: "nil",
                                               clientSecret: nil,
                                               scope: nil,
                                               refreshToken: nil,
                                               codeVerifier: nil,
                                               additionalParameters: nil)
        
        let mockTokenResponse = OKTTokenResponse(
            request: mockTokenRequest,
            parameters: [
                "access_token": "mockAccessToken" as NSCopying & NSObjectProtocol,
                "expires_in": Date().addingTimeInterval(3600).timeIntervalSince1970 as NSCopying & NSObjectProtocol,
                "token_type": "Bearer" as NSCopying & NSObjectProtocol,
                "id_token": mockIdToken as NSCopying & NSObjectProtocol,
                "refresh_token": "refreshToken" as NSCopying & NSObjectProtocol,
                "scope": "openid offline_access" as NSCopying & NSObjectProtocol
            ]
        )
        
        let mockAuthRequest = OKTAuthorizationRequest(
            configuration: serviceConfig,
            clientId: configuration.clientId,
            clientSecret: nil,
            scopes: ["openid", "email"],
            redirectURL: configuration.redirectUri,
            responseType: OKTResponseTypeCode,
            additionalParameters: nil
        )
        
        let mockAuthResponse = OKTAuthorizationResponse(
            request: mockAuthRequest,
            parameters: ["code": "mockAuthCode" as NSCopying & NSObjectProtocol]
        )
        
        let authState = OKTAuthState(authorizationResponse: mockAuthResponse, tokenResponse: mockTokenResponse)
        return OktaOidcStateManager(authState: authState)
    }
}

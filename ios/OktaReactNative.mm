#import <React/RCTEventEmitter.h>
#import "ReactNativeOktaSdkBridge-Bridging-Header.h"


#ifdef RCT_NEW_ARCH_ENABLED
#import "RNOktaReactNativeSpec.h"

@interface 
RCT_EXTERN_MODULE(OktaReactNative, RCTEventEmitter<NativeOktaReactNativeSpec>)
#else
#import <React/RCTBridgeModule.h>

@interface

RCT_EXTERN_MODULE(OktaReactNative, RCTEventEmitter<RCTBridgeModule>)

#endif



RCT_EXTERN_METHOD(
  createConfig:(NSDictionary*)options
  successCallback:(RCTResponseSenderBlock *)successCallback
  errorCallback:(RCTResponseSenderBlock *)errorCallback
)

RCT_EXTERN_METHOD(
  signIn:(NSDictionary*)options
  promiseResolver:(RCTPromiseResolveBlock *)promiseResolver
  promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter
)

RCT_EXTERN_METHOD(
  authenticate:
  (NSString *)sessionToken
  promiseResolver:(RCTPromiseResolveBlock *)promiseResolver
  promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter
)

RCT_EXTERN_METHOD(signOut:(RCTPromiseResolveBlock *)promiseResolver
                  promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(getAccessToken:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(getIdToken:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(getUser:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(isAuthenticated:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(revokeAccessToken:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(revokeIdToken:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(revokeRefreshToken:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(introspectAccessToken:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(introspectIdToken:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(introspectRefreshToken:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(refreshTokens:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

RCT_EXTERN_METHOD(clearTokens:(RCTPromiseResolveBlock *)promiseResolver promiseRejecter:(RCTPromiseRejectBlock *)promiseRejecter)

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeOktaReactNativeSpecJSI>(params);
}
#endif

@end

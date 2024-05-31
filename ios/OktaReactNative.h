#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNOktaReactNativeSpec.h"

@interface OktaReactNative : RCTEventEmitter <NativeOktaReactNativeSpec>
#else
#import <React/RCTBridgeModule.h>

@interface OktaReactNative : RCTEventEmitter <RCTBridgeModule>
#endif

@end

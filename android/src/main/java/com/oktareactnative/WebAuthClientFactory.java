package com.oktareactnative;

import android.content.Context;
import android.graphics.Color;

import com.okta.oidc.OIDCConfig;
import com.okta.oidc.Okta;
import com.okta.oidc.clients.web.WebAuthClient;
import com.okta.oidc.storage.SharedPreferenceStorage;

public class WebAuthClientFactory {

    public static WebAuthClient getWebAuthClient(
        OIDCConfig config,
        Context context,
        boolean isHardwareBackedKeyStoreRequired,
        String androidChromeTabColor,
        Boolean browserMatchAll,
        String userAgentTemplate,
        int connectTimeoutMs,
        int readTimeoutMs
    ) throws IllegalArgumentException {
        Okta.WebAuthBuilder webAuthBuilder = new Okta.WebAuthBuilder();

        webAuthBuilder.withConfig(config)
                .withOktaHttpClient(new HttpClientImpl(userAgentTemplate, connectTimeoutMs, readTimeoutMs))
                .withContext(context)
                .withStorage(new SharedPreferenceStorage(context))
                .setRequireHardwareBackedKeyStore(isHardwareBackedKeyStoreRequired);

        if (androidChromeTabColor != null) {
            webAuthBuilder.withTabColor(Color.parseColor(androidChromeTabColor));
        }

        if (browserMatchAll != null && browserMatchAll) {
            webAuthBuilder.browserMatchAll(true);
        }
        return webAuthBuilder.create();
    }
}

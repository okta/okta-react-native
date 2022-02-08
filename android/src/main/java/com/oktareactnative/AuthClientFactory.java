package com.oktareactnative;

import android.content.Context;

import com.okta.oidc.OIDCConfig;
import com.okta.oidc.Okta;
import com.okta.oidc.clients.AuthClient;
import com.okta.oidc.storage.SharedPreferenceStorage;

public class AuthClientFactory {

    public static AuthClient getAuthClient(
        OIDCConfig config,
        Context context,
        boolean isHardwareBackedKeyStoreRequired,
        String userAgentTemplate,
        int connectTimeoutMs,
        int readTimeoutMs
    ) {
        Okta.AuthBuilder authClientBuilder = new Okta.AuthBuilder();

        authClientBuilder.withConfig(config)
            .withOktaHttpClient(new HttpClientImpl(userAgentTemplate, connectTimeoutMs, readTimeoutMs))
            .withContext(context)
            .withStorage(new SharedPreferenceStorage(context))
            .setRequireHardwareBackedKeyStore(isHardwareBackedKeyStoreRequired);

        return authClientBuilder.create();
    }
}

/*
 * Copyright (c) 2019, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

package com.oktareactnative;

import static com.okta.oidc.net.ConnectionParameters.USER_AGENT;

import android.net.Uri;

import androidx.annotation.NonNull;

import com.okta.oidc.BuildConfig;
import com.okta.oidc.net.ConnectionParameters;
import com.okta.oidc.net.OktaHttpClient;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class HttpClientImpl implements OktaHttpClient {
    private final String userAgentTemplate;
    private final int connectTimeoutMs;
    private final int readTimeoutMs;
    protected static OkHttpClient sOkHttpClient;
    protected volatile Call mCall;
    protected Response mResponse;
    protected Exception mException;

    HttpClientImpl(String userAgentTemplate, int connectTimeoutMs, int readTimeoutMs) {
        this.userAgentTemplate = userAgentTemplate;
        this.connectTimeoutMs = connectTimeoutMs;
        this.readTimeoutMs = readTimeoutMs;
    }

    private String getUserAgent() {
        String sdkVersion = "okta-oidc-android/" + BuildConfig.VERSION_NAME;
        return userAgentTemplate.replace("$UPSTREAM_SDK", sdkVersion);
    }

    protected Request buildRequest(Uri uri, ConnectionParameters param) {
        if (sOkHttpClient == null) {
            sOkHttpClient = new OkHttpClient.Builder()
                    .connectTimeout(connectTimeoutMs, TimeUnit.MILLISECONDS)
                    .readTimeout(readTimeoutMs, TimeUnit.MILLISECONDS)
                    .build();
        }
        Request.Builder requestBuilder = new Request.Builder().url(uri.toString());
        requestBuilder.addHeader(USER_AGENT, getUserAgent());
        for (Map.Entry<String, String> headerEntry : param.requestProperties().entrySet()) {
            String key = headerEntry.getKey();
            requestBuilder.addHeader(key, headerEntry.getValue());
        }
        if (param.requestMethod() == ConnectionParameters.RequestMethod.GET) {
            requestBuilder = requestBuilder.get();
        } else {
            Map<String, String> postParameters = param.postParameters();
            if (postParameters != null) {
                FormBody.Builder formBuilder = new FormBody.Builder();
                for (Map.Entry<String, String> postEntry : postParameters.entrySet()) {
                    String key = postEntry.getKey();
                    formBuilder.add(key, postEntry.getValue());
                }
                RequestBody formBody = formBuilder.build();
                requestBuilder.post(formBody);
            } else {
                requestBuilder.post(RequestBody.create(null, ""));
            }
        }
        return requestBuilder.build();
    }

    @Override
    public InputStream connect(@NonNull Uri uri, @NonNull ConnectionParameters params)
            throws Exception {
        Request request = buildRequest(uri, params);
        mCall = sOkHttpClient.newCall(request);
        final CountDownLatch latch = new CountDownLatch(1);
        mCall.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                mException = e;
                latch.countDown();
            }

            @Override
            public void onResponse(Call call, Response response) {
                mResponse = response;
                latch.countDown();
            }
        });
        latch.await();
        if (mException != null) {
            throw mException;
        }
        if (mResponse != null && mResponse.body() != null) {
            return mResponse.body().byteStream();
        }
        return null;
    }

    @Override
    public void cleanUp() {
        //NO-OP
    }

    @Override
    public void cancel() {
        if (mCall != null) {
            mCall.cancel();
        }
    }

    @Override
    public Map<String, List<String>> getHeaderFields() {
        if (mResponse != null) {
            return mResponse.headers().toMultimap();
        }
        return null;
    }

    @Override
    public String getHeader(String header) {
        if (mResponse != null) {
            return mResponse.header(header);
        }
        return null;
    }

    @Override
    public int getResponseCode() throws IOException {
        if (mResponse != null) {
            return mResponse.code();
        }
        return -1;
    }

    @Override
    public int getContentLength() {
        if (mResponse != null && mResponse.body() != null) {
            return (int) mResponse.body().contentLength();
        }
        return -1;
    }

    @Override
    public String getResponseMessage() throws IOException {
        if (mResponse != null) {
            return mResponse.message();
        }
        return null;
    }
}

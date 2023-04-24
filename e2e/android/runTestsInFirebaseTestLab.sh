#!/usr/bin/env bash

set -e # Fail on error.

gcloud firebase test android run \
    --no-auto-google-login \
    --type instrumentation \
    --app app/build/outputs/apk/debug/app-debug.apk \
    --test app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk \
    --device model=oriole,version=32,locale=en_US,orientation=portrait \
    --timeout 5m --no-performance-metrics \
    --use-orchestrator \
    --environment-variables clearPackageData=true \
    & PID_APP=$!

wait $PID_APP

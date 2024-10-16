#!/bin/bash

source $OKTA_HOME/$REPO/scripts/setup.sh

export TEST_SUITE_TYPE="build"
export REGISTRY="${ARTIFACTORY_URL}/api/npm/npm-topic"

if [ -n "${action_branch}" ];
then
  echo "Publishing from bacon task using branch ${action_branch}"
  TARGET_BRANCH=${action_branch}
else
  echo "Publishing from bacon testSuite using branch ${BRANCH}"
  TARGET_BRANCH=${BRANCH}
fi

pushd ./dist

if ! yarn dlx @okta/ci-append-sha; then
  echo "ci-append-sha failed! Exiting..."
  exit ${FAILED_SETUP}
fi

npm config set @okta:registry ${REGISTRY}
if ! npm publish --registry ${REGISTRY}; then
  echo "npm publish failed! Exiting..."
  exit ${PUBLISH_ARTIFACTORY_FAILURE}
fi

popd

exit $SUCCESS

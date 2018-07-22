#!/usr/bin/env bash -e

PACKAGE_VERSION=$1
npm version ${PACKAGE_VERSION#*v} --no-git-tag-version --allow-same-version

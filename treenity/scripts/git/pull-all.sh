#!/usr/bin/env bash

set -e

#echo ~$1~ ~$2~ ~$3~ && exit

BRANCH=dev
if [ -n "$1" ]; then
  BRANCH=$1
fi

echo "checking out branch $BRANCH"

git fetch
git pull origin
git submodule update --init --recursive
#git submodule update --recursive --remote
git submodule foreach --recursive "git checkout $BRANCH"
git submodule foreach --recursive "git pull origin $BRANCH"

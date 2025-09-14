#!/usr/bin/env bash

set -e

M=$1

if [ -z "$M" ]; then
  echo usage: $0 "<module>" && exit 1
fi

git submodule deinit $M
git rm -r $M
git commit -m "Removed submodule "
rm -rf .git/modules/$M

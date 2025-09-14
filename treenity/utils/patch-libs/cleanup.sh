#!/usr/bin/env bash

cd $(dirname $0)

set -e

. ./utils.sh

PNPM_ROOT=$(find_file_up "node_modules/.pnpm")
rm $PNPM_ROOT/.patches.md5
PATCHES=$(ls patches)

# link modules locally from global node_modules
for p in $PATCHES; do
  p=$(echo $p | sed 's/.patch$//')
  MODULE=$(echo "$p" | sed -E 's/\+[^+]*$//' | sed 's/+/\//')
  MODULE_VER=$(echo "$p" | rev | sed 's/+/@/' | rev)

  if [ -h node_modules/$MODULE ]; then
    rm node_modules/$MODULE
  fi
done

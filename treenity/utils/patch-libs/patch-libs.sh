#!/usr/bin/env bash

cd $(dirname $0)

set -e
# import functions
. utils.sh

PNPM_ROOT=$(find_file_up "node_modules/.pnpm")
HASHES="patches $PNPM_ROOT/.patches.md5"

if check_hash_changes $HASHES; then
  echo "@treenity/patch-libs already applied: $PNPM_ROOT/.patches.md5"
  . cleanup.sh
fi

PATCHES=$(ls patches)

# link modules locally from global node_modules
for P in $PATCHES; do
  p=$(echo $P | sed 's/.patch$//')
  MODULE=$(echo "$p" | sed -E 's/\+[^+]*$//' | sed 's/+/\//')
  MODULE_VER=$(echo "$p" | rev | sed 's/+/@/' | rev)

  if [ ! -h node_modules/$MODULE ]; then
    # remove if it is dir, pnpm create dir instead of symlink
    if [ -d node_modules/$MODULE ]; then rm -rf node_modules/$MODULE; fi

    MODULE_NPM=$(ls $PNPM_ROOT | grep $MODULE_VER | head -n 1)
    FROM=$PNPM_ROOT/$MODULE_NPM/node_modules/$MODULE
    if [ -d "$FROM" ]; then
      echo "Package not found in local node_modules, linking $MODULE -> $FROM"
      mkdir -p $(dirname node_modules/$MODULE)
      ln -s $FROM node_modules/$MODULE
    else
      echo "Warning: Package $MODULE not found in pnpm store. Skipping patch for this package."
      if [ ! -z "$CI" ]; then
        rm patches/$P
      fi
    fi
  fi
done

# Only run patch-package if there are remaining patch files
if [ "$(ls -A patches)" ]; then
  node_modules/.bin/patch-package --exclude ''
else
  echo "No valid patches remaining. Skipping patch-package."
fi

update_hashes $HASHES

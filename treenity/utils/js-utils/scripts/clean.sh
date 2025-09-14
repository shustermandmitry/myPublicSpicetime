#!/bin/sh

if [ ! -d 'node_modules' ]; then
  echo "Node modules not found. cant clean"
  exit 1
fi

rm -rf dist node_modules/.cache node_modules/.vite .turbo stats.html .cache build vite.config.mjs.*

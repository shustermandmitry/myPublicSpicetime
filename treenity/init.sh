#!/usr/bin/env bash

# get all submodules to init scripts dir
git submodule update --init --recursive --force && git submodule foreach --recursive "git checkout dev"

. scripts/init/prerequesites.sh

$BASH scripts/git/pull-all.sh

# install and build
pnpm install
pnpm build

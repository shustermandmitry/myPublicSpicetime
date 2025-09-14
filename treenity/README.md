# Treenity

[![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/treenity)](https://artifacthub.io/packages/search?repo=treenity)

## quick init

```sh
bash init.sh
```

to quickly init project (MacOS tested, Linux supported)

## prerequisites

1. node >= 20: use nvm to manage node versions: https://github.com/nvm-sh/nvm#installing-and-updating
2. pnpm installed: `npm i -g pnpm`

## installation

1. checkout this repo to local dir
1. run
    ```sh
    bash scripts/git/pull-all.sh
    ```
1. clone treenity repo inside:
   ```sh
    git clone git@gitlab.com:txt-dev/treenity/treenity.git
   ```
1. run `bash scripts/git/pull-all.sh` in treenity directory
1. run `pnpm i`
1. run `pnpm build`


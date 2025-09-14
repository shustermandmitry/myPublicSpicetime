# @treenity/core docs
### Installation
Create token with "api" **scope** [here](https://gitlab.com/-/profile/personal_access_tokens).
Add private registry info to .npmrc file in root of project
```
@cluster:registry=https://gitlab.com/api/v4/projects/35830151/packages/npm/
//gitlab.com/api/v4/projects/35830151/packages/npm/:_authToken=${TOKEN}
```
Install:
```
TOKEN=<access_token> npm i @cluster/protocol
```

### Publish new version
To publish new version you need gilab api access key:
```bash
MY_TOKEN=<access_token> npm publish
```
